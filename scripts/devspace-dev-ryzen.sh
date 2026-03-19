#!/usr/bin/env bash

set -euo pipefail

APP_NAMESPACE="argocd"
WORKLOAD_NAMESPACE="workflow-builder"
PROJECT_ROOT="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
SKIP_RECONCILE_ANNOTATION="argocd.argoproj.io/skip-reconcile"
REFRESH_ANNOTATION="argocd.argoproj.io/refresh"
ARGO_APP="ai-chatbot"
DEVSPACE_REPLACEMENT_DEPLOYMENT="ai-chatbot-devspace"
PRODUCTION_DEPLOYMENT="ai-chatbot"

cleanup() {
  local exit_code="$1"

  set +e

  printf '\n==> Resetting DevSpace pods\n'
  (
    cd "$PROJECT_ROOT"
    devspace reset pods --silent --force
  )

  printf '==> Waiting for %s to disappear\n' "$DEVSPACE_REPLACEMENT_DEPLOYMENT"
  kubectl wait \
    --namespace "$WORKLOAD_NAMESPACE" \
    --for=delete "deployment/${DEVSPACE_REPLACEMENT_DEPLOYMENT}" \
    --timeout=180s >/dev/null 2>&1 || true

  printf '==> Resuming ArgoCD reconciliation for %s\n' "$ARGO_APP"
  kubectl annotate application "$ARGO_APP" \
    --namespace "$APP_NAMESPACE" \
    "${SKIP_RECONCILE_ANNOTATION}-" >/dev/null 2>&1 || true
  kubectl annotate application "$ARGO_APP" \
    --namespace "$APP_NAMESPACE" \
    "${REFRESH_ANNOTATION}=hard" \
    --overwrite >/dev/null 2>&1 || true

  printf '==> Waiting for the production deployment %s to be ready again\n' "$PRODUCTION_DEPLOYMENT"
  kubectl rollout status \
    --namespace "$WORKLOAD_NAMESPACE" \
    "deployment/${PRODUCTION_DEPLOYMENT}" \
    --timeout=180s >/dev/null 2>&1 || true

  exit "$exit_code"
}

main() {
  trap 'cleanup "$?"' EXIT
  trap 'exit 130' INT
  trap 'exit 143' TERM

  printf '==> Using kube context: %s\n' "$(kubectl config current-context 2>/dev/null || echo unknown)"
  printf '==> Verifying ArgoCD application %s exists\n' "$ARGO_APP"
  kubectl get application "$ARGO_APP" --namespace "$APP_NAMESPACE" >/dev/null

  printf '==> Pausing ArgoCD reconciliation for %s\n' "$ARGO_APP"
  kubectl annotate application "$ARGO_APP" \
    --namespace "$APP_NAMESPACE" \
    "${SKIP_RECONCILE_ANNOTATION}=true" \
    --overwrite >/dev/null

  printf '==> Starting DevSpace session\n'
  cd "$PROJECT_ROOT"
  devspace dev "$@"
}

main "$@"
