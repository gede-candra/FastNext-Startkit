export type BackendStatus = {
  status: string;
  detail: string;
  environment?: string;
};

export type MetricItem = {
  label: string;
  value: string;
  detail: string;
};

export type FeatureItem = {
  title: string;
  description: string;
};

export type StepItem = {
  label: string;
  title: string;
  description: string;
};

export type StackItem = {
  title: string;
  items: string[];
};

export type HomepageContent = {
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    primaryAction: string;
    secondaryAction: string;
  };
  metrics: MetricItem[];
  features: FeatureItem[];
  steps: StepItem[];
  stacks: StackItem[];
};

export type HomepageViewModel = HomepageContent & {
  appName: string;
  apiPrefix: string;
};
