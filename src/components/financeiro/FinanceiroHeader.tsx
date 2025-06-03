
interface FinanceiroHeaderProps {
  title: string
  subtitle: string
}

export const FinanceiroHeader = ({ title, subtitle }: FinanceiroHeaderProps) => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground">{title}</h1>
      <p className="text-muted-foreground">{subtitle}</p>
    </div>
  )
}
