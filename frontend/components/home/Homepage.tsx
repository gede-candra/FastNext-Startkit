import { BackendStatusCard } from "./BackendStatusCard";
import type { HomepageViewModel } from "../../types/home";

type HomepageProps = {
  viewModel: HomepageViewModel;
};

export function Homepage({ viewModel }: HomepageProps) {
  return (
    <main className="welcomePage">
      <section className="welcomePanel" aria-labelledby="welcome-title">
        <img className="welcomeLogo" src="/fastnext-logo.png" alt={`${viewModel.appName} logo`} />
        <p className="eyebrow">{viewModel.hero.eyebrow}</p>
        <h1 id="welcome-title">{viewModel.hero.title}</h1>
        <p className="welcomeSubtitle">{viewModel.hero.subtitle}</p>

        <div className="welcomeLinks" aria-label="Project links">
          {viewModel.features.map((feature) => (
            <a key={feature.title} href={feature.title === "Backend API" ? `${viewModel.apiPrefix}/v1/health` : "#"}>
              <span>{feature.title}</span>
              <small>{feature.description}</small>
            </a>
          ))}
        </div>

        <div className="welcomeFooter">
          <span>{viewModel.metrics.map((metric) => metric.value).join(" / ")}</span>
          <BackendStatusCard apiPrefix={viewModel.apiPrefix} />
        </div>
      </section>
    </main>
  );
}
