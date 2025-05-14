import { ReactNode } from "react";
import { useRole } from "../../../lib/context/RoleContext";

interface FeatureGatedProps {
  /** The feature flag to check - corresponds to a key in the contextualFeatures object */
  feature: string;
  /** Content to show when feature is enabled */
  children: ReactNode;
  /** Content to show when feature is disabled (optional) */
  fallback?: ReactNode;
}

/**
 * FeatureGated component renders content conditionally based on role-specific feature flags
 *
 * Usage:
 * <FeatureGated feature="showAdvancedClinical">
 *   <AdvancedClinicalContent />
 * </FeatureGated>
 */
export function FeatureGated({
  feature,
  children,
  fallback,
}: FeatureGatedProps) {
  const { roleConfig } = useRole();

  // Check if the current role has the specified feature enabled
  const isFeatureEnabled = roleConfig?.contextualFeatures?.[feature] === true;

  if (isFeatureEnabled) {
    return <>{children}</>;
  }

  // Return the fallback component if provided, otherwise null
  return fallback ? <>{fallback}</> : null;
}

interface AdaptiveContainerProps {
  /**
   * The feature requirement for this container
   * This should match a key in the contextualFeatures object
   */
  requires?: string;
  /**
   * An array of feature requirements (all must be satisfied)
   */
  requiresAll?: string[];
  /**
   * An array of feature requirements (at least one must be satisfied)
   */
  requiresAny?: string[];
  /** Content to display when requirements are met */
  children: ReactNode;
  /** Optional fallback content */
  fallback?: ReactNode;
  /** Additional CSS classes */
  className?: string;
}

/**
 * AdaptiveContainer provides a contextual wrapper that adapts UI based on
 * role permissions and contextual features
 *
 * Usage:
 * <AdaptiveContainer requires="showMedicalRecordTabs">
 *   <MedicalRecordTabs />
 * </AdaptiveContainer>
 *
 * <AdaptiveContainer requiresAll={["showPatientBanner", "showAdvancedClinical"]}>
 *   <AdvancedPatientBanner />
 * </AdaptiveContainer>
 */
export function AdaptiveContainer({
  requires,
  requiresAll,
  requiresAny,
  children,
  fallback,
  className,
}: AdaptiveContainerProps) {
  const { roleConfig } = useRole();

  if (!roleConfig) {
    return fallback ? <div className={className}>{fallback}</div> : null;
  }

  // Check if a single feature is required
  if (requires) {
    const isFeatureEnabled = roleConfig.contextualFeatures?.[requires] === true;
    if (!isFeatureEnabled) {
      return fallback ? <div className={className}>{fallback}</div> : null;
    }
  }

  // Check if all features in the array are required
  if (requiresAll && requiresAll.length > 0) {
    const allFeaturesEnabled = requiresAll.every(
      (feature) => roleConfig.contextualFeatures?.[feature] === true
    );

    if (!allFeaturesEnabled) {
      return fallback ? <div className={className}>{fallback}</div> : null;
    }
  }

  // Check if any features in the array are required
  if (requiresAny && requiresAny.length > 0) {
    const anyFeatureEnabled = requiresAny.some(
      (feature) => roleConfig.contextualFeatures?.[feature] === true
    );

    if (!anyFeatureEnabled) {
      return fallback ? <div className={className}>{fallback}</div> : null;
    }
  }

  // If we've passed all the checks, render the children
  return <div className={className}>{children}</div>;
}
