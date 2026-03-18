interface PageHeaderProps {
  title: string;
  description: string;
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold tracking-tight text-balance">{title}</h2>
      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground max-w-xl">{description}</p>
    </div>
  );
}
