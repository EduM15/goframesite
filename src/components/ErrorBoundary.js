import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Atualiza o estado para que a próxima renderização mostre a UI de fallback.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Você também pode logar o erro para um serviço de relatórios
    console.error("Erro capturado pelo ErrorBoundary:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // Renderiza qualquer UI de fallback que você queira
      return (
        <div className="bg-background text-white min-h-screen p-8 font-poppins flex flex-col items-center justify-center">
          <div className="bg-surface p-8 rounded-lg max-w-2xl text-center">
            <h1 className="text-2xl font-bebas-neue text-danger mb-4">Ocorreu um Erro Crítico</h1>
            <p className="text-text-secondary mb-4">A aplicação encontrou um problema e não pôde continuar. Atualizar a página pode resolver o problema.</p>
            <details className="bg-background p-4 rounded-md text-left text-xs text-text-secondary">
              <summary className="cursor-pointer font-bold">Detalhes Técnicos do Erro</summary>
              <pre className="whitespace-pre-wrap mt-2">
                {this.state.error && this.state.error.toString()}
                <br />
                {this.state.errorInfo && this.state.errorInfo.componentStack}
              </pre>
            </details>
          </div>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;