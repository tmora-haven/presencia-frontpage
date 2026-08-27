import { Component, type ErrorInfo, type ReactNode } from 'react';
import { SectionError } from './SectionState';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * Catches *render* errors (a malformed payload slipping past normalisation,
 * a bug in a card) so they stay contained to one section. Fetch errors are
 * handled by the hooks; this is the last line of defence.
 */
export class SectionBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // In production this would go to an error tracker (Sentry, etc.).
    console.error('Section render error', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return <SectionError onRetry={() => this.setState({ hasError: false })} />;
    }
    return this.props.children;
  }
}
