import { Breadcrumb, type BreadcrumbItem } from "./Breadcrumb";

type PageHeadingProps = {
  items: BreadcrumbItem[];
  title: string;
};

export function PageHeading({ items, title }: PageHeadingProps) {
  return (
    <section className="dashboardPageHeading" aria-labelledby="dashboard-page-title">
      <Breadcrumb items={items} />
      <h1 id="dashboard-page-title">{title}</h1>
    </section>
  );
}
