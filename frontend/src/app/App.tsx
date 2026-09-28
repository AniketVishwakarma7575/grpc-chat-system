import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { WorkspaceDemo } from '../features/workspace/WorkspaceDemo'
import { DesignSystemPage } from '../dev/DesignSystemPage'
import { AppProviders } from './providers'

export function App() {
  return (
    <AppProviders>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<WorkspaceDemo />} />
          <Route path="/dev/design" element={<DesignSystemPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProviders>
  )
}
