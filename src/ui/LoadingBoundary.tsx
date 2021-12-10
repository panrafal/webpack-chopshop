import { Suspense } from "react"
import { ErrorBoundary, FallbackProps } from "react-error-boundary"
import ErrorBox from "./ErrorBox"

type Props = {
  fallback: React.ReactNode
  errorComponent?: React.ComponentType<FallbackProps>
  children: React.ReactNode
}
function LoadingBoundary({
  fallback,
  errorComponent = ErrorBox,
  children,
}: Props) {
  return (
    <ErrorBoundary FallbackComponent={errorComponent}>
      <Suspense fallback={fallback || null}>{children}</Suspense>
    </ErrorBoundary>
  )
}

export default LoadingBoundary
