"""model.py — Shared model definition for training and inference."""

import torch
import torch.nn as nn
import torch.nn.functional as F


class RMSNorm(nn.Module):
    def __init__(self, dim, eps=1e-6):
        super().__init__()
        self.weight = nn.Parameter(torch.ones(dim))
        self.eps = eps

    def forward(self, x):
        norm = x.float().pow(2).mean(-1, keepdim=True).add(self.eps).rsqrt()
        return (x.float() * norm).type_as(x) * self.weight


class Attention(nn.Module):
    def __init__(self, dim, n_heads, dropout=0.0):
        super().__init__()
        self.n_heads = n_heads
        self.head_dim = dim // n_heads
        self.qkv = nn.Linear(dim, 3 * dim, bias=False)
        self.out = nn.Linear(dim, dim, bias=False)
        self.attn_drop = dropout

    def forward(self, x):
        B, T, C = x.shape
        qkv = self.qkv(x).reshape(B, T, 3, self.n_heads, self.head_dim)
        q, k, v = qkv.unbind(2)
        q, k, v = q.transpose(1, 2), k.transpose(1, 2), v.transpose(1, 2)
        out = F.scaled_dot_product_attention(
            q, k, v, is_causal=True,
            dropout_p=self.attn_drop if self.training else 0.0,
        )
        return self.out(out.transpose(1, 2).reshape(B, T, C))


class FFN(nn.Module):
    def __init__(self, dim, ff_dim, dropout=0.0):
        super().__init__()
        self.w1 = nn.Linear(dim, ff_dim, bias=False)
        self.w2 = nn.Linear(ff_dim, dim, bias=False)
        self.w3 = nn.Linear(dim, ff_dim, bias=False)
        self.drop = nn.Dropout(dropout)

    def forward(self, x):
        return self.drop(self.w2(F.silu(self.w1(x)) * self.w3(x)))


class Block(nn.Module):
    def __init__(self, dim, n_heads, ff_dim, dropout=0.0):
        super().__init__()
        self.norm1 = RMSNorm(dim)
        self.attn = Attention(dim, n_heads, dropout)
        self.norm2 = RMSNorm(dim)
        self.ffn = FFN(dim, ff_dim, dropout)
        self.drop = nn.Dropout(dropout)

    def forward(self, x):
        x = x + self.drop(self.attn(self.norm1(x)))
        x = x + self.drop(self.ffn(self.norm2(x)))
        return x


class EinsteinModel(nn.Module):
    def __init__(self, vocab_size, dim, n_heads, n_layers, ff_dim, max_seq_len, dropout=0.0):
        super().__init__()
        self.tok_emb = nn.Embedding(vocab_size, dim)
        self.pos_emb = nn.Embedding(max_seq_len, dim)
        self.drop = nn.Dropout(dropout)
        self.blocks = nn.ModuleList(
            [Block(dim, n_heads, ff_dim, dropout) for _ in range(n_layers)]
        )
        self.norm = RMSNorm(dim)
        self.head = nn.Linear(dim, vocab_size, bias=False)
        self.tok_emb.weight = self.head.weight  # weight tying
        self._init_weights()

    def _init_weights(self):
        """GPT-2 style init with residual scaling."""
        n_layers = len(self.blocks)
        for name, p in self.named_parameters():
            if p.dim() < 2:
                continue
            # Residual projections get scaled init
            if name.endswith("out.weight") or name.endswith("w2.weight"):
                nn.init.normal_(p, mean=0.0, std=0.02 / (2 * n_layers) ** 0.5)
            else:
                nn.init.normal_(p, mean=0.0, std=0.02)

    def forward(self, x):
        B, T = x.shape
        pos = torch.arange(T, device=x.device).unsqueeze(0)
        x = self.drop(self.tok_emb(x) + self.pos_emb(pos))
        for block in self.blocks:
            x = block(x)
        return self.head(self.norm(x))
