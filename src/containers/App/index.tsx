import React from 'react';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import Header from '../../components/Header';
import { CharactersPage } from '../CharactersPage';
import { AppErrorFallback } from '../../components/AppErrorFallback';

import styles from './index.module.scss';

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary FallbackComponent={AppErrorFallback}>
        <Router>
          <div className={styles.app}>
            <Header />
            <main className={styles.main}>
              <Routes>
                <Route path="/" element={<CharactersPage />} />
              </Routes>
            </main>
          </div>
        </Router>
      </ErrorBoundary>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
};

export default App;
