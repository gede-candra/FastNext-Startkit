import Link from "next/link";

type BreadcrumbItem = {
  href?: string;
  label: string;
};

type DashboardPageHeadingProps = {
  items: BreadcrumbItem[];
  title: string;
};

export function DashboardPageHeading({ items, title }: DashboardPageHeadingProps) {
  return (
    <section className="dashboardPageHeading" aria-labelledby="dashboard-page-title">
      <nav aria-label="Breadcrumb" className="breadcrumb">
        <ol>
          {items.map((item, index) => {
            const isLast = index === items.length - 1;

            return (
              <li key={`${item.label}-${index}`}>
                {item.href && !isLast ? <Link href={item.href}>{item.label}</Link> : <span>{item.label}</span>}
              </li>
            );
          })}
        </ol>
      </nav>
      <h1 id="dashboard-page-title">{title}</h1>
    </section>
  );
}
