'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { client } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, Loader2, Star } from "lucide-react";
import { toast } from "sonner";
import { Subscription } from "@better-auth/stripe";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useState } from "react";

// Define plan features (same as before)
const plansData = [
	{
		id: "starter",
		name: "Starter",
		price: "$50",
        period: "/month",
		features: [
			"1000 Minutes Cold Call Training",
			"500 Cold Email Generation",
			"100 Prospect Analysis",
			"100 LinkedIn Leads",
            "300 Minuted of Conversation Intelligence",
            "200 Pre Call Planner",
            "Objection Training",
            "Organizational Playbook"
		],
        isPopular: false,
	},
	{
		id: "professional",
		name: "Professional",
		price: "$99",
        period: "/month",
		features: [
			"5000 Minutes Cold Call Training",
			"1000 Cold Email Generation",
			"500 Prospect Analysis",
			"500 LinkedIn Leads",
            "1000 Minuted of Conversation Intelligence",
            "500 Pre Call Planner",
            "5 Team Members",
            "Objection Training",
            "Organizational Playbook",
            "Customized AI Features",
            "Dedicated Infrastructure",
            "API Access",
            "24/7 Phone Support",
            "Custom Integrations"
		],
        isPopular: true, // Example: Mark Professional as popular
	},
	{
		id: "enterprise",
		name: "Enterprise",
		price: "Custom",
        period: "",
		features: [
			"Unlimited Users",
			"Customized AI Features",
			"Dedicated Infrastructure",
			"24/7 Phone Support",
			"Custom Integrations",
		],
        isPopular: false,
	},
];

// Define the plan upgrade params type
interface PlanUpgradeParams {
    planId: string;
    annual: boolean;
}

export function BillingView() {
    const queryClient = useQueryClient();
    const [isAnnual, setIsAnnual] = useState(false);
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
    const [planToChangeTo, setPlanToChangeTo] = useState<string | null>(null);

    // Fetch current subscription
    const { data: subscriptionData, isLoading: isLoadingSubscription, error } = useQuery({
        queryKey: ["subscription"], 
        queryFn: async () => {
            // Assuming client returns { data: [], error: null } or similar
            const res = await client.subscription.list();
            if (res.error) {
                throw new Error(res.error.message || "Failed to fetch subscription");
            }
            // Access the data array
            return res.data.length ? res.data[0] : null;
        },
        // Optional: Add retry logic or stale time if needed
    });

    // Get the actual subscription object from the query data
    const subscription: Subscription | null = subscriptionData || null;

    // Mutation for changing/upgrading plan
    const changePlanMutation = useMutation({
        mutationFn: async (params: PlanUpgradeParams) => {
            if (params.planId === 'enterprise') {
                toast.info("Please contact sales for Enterprise plan details.");
                return Promise.reject(new Error("Contact sales")); // Prevent further processing
            }
            // Use upgrade, Stripe handles downgrade/upgrade logic
            return client.subscription.upgrade({ 
                plan: params.planId,
                annual: params.annual
            });
        },
        onSuccess: (data, variables) => {
            toast.success(`Subscription updated to ${variables.planId} plan!`);
            queryClient.invalidateQueries({ queryKey: ['subscription'] });
            queryClient.invalidateQueries({ queryKey: ['session'] }); // Also invalidate session if plan affects user data
        },
        // eslint-disable-next-line
        onError: (error: Error, variables) => {
            if (error.message !== "Contact sales") { // Don't show error for enterprise contact
                 toast.error(`Failed to change plan: ${error.message}`);
            }
        },
    });

     // Mutation for cancelling plan
    const cancelPlanMutation = useMutation({
        mutationFn: async () => {
            if (!subscription) return;
            // Using cancel which redirects to Stripe billing portal
            return client.subscription.cancel({ returnUrl: window.location.href });
        },
        onSuccess: () => {
            // Usually won't reach here due to redirect, but good practice
            toast.success("Redirecting to manage subscription...");
             queryClient.invalidateQueries({ queryKey: ['subscription'] });
             queryClient.invalidateQueries({ queryKey: ['session'] });
        },
        onError: (error: Error) => {
            toast.error(`Failed to cancel plan: ${error.message}`);
        },
    });

    // Mutation for updating payment method
    const updatePaymentMutation = useMutation({
        mutationFn: async () => {
            // Redirect to Stripe portal for payment update/management
            return client.subscription.cancel({ returnUrl: window.location.href });
        },
        // eslint-disable-next-line
        onSuccess: (data) => {
            // Redirect logic might need adjustment if cancel always shows cancel flow first
            // However, Stripe portal usually allows managing payment methods regardless
            toast.success("Redirecting to manage payment details...");
            // Optionally keep the redirect check if cancel provides a specific portal URL in data
            // if (data?.url) { 
            //     window.location.href = data.url;
            // } 
        },
        onError: (error: Error) => {
            toast.error(`Failed to redirect to payment portal: ${error.message}`);
        },
    });

    // Mutation for restoring a canceled subscription
    const restoreSubscriptionMutation = useMutation({
        mutationFn: async () => {
            if (!subscription) return;
            return client.subscription.restore();
        },
        onSuccess: () => {
            toast.success("Subscription restored successfully!");
            queryClient.invalidateQueries({ queryKey: ['subscription'] });
            queryClient.invalidateQueries({ queryKey: ['session'] });
        },
        onError: (error: Error) => {
            toast.error(`Failed to restore subscription: ${error.message}`);
        },
    });

    const currentPlanId = subscription?.plan?.toLowerCase();
    const isTrial = subscription?.status === 'trialing';
    
    // Access currentPeriodEnd, casting to any as a workaround for potentially missing type
    // Stripe timestamps are in seconds, Date expects milliseconds
    const currentPeriodEndTimestamp = (subscription as any)?.currentPeriodEnd;
    const currentPeriodEnd = currentPeriodEndTimestamp ? new Date(currentPeriodEndTimestamp * 1000) : null;

    // Function to handle plan changes
    const handleChangePlan = (planId: string) => {
        // Confirm before upgrading
        setIsConfirmDialogOpen(true);
        setPlanToChangeTo(planId);
    };

    // Function to confirm plan upgrade
    const confirmChangePlan = () => {
        if (planToChangeTo) {
            changePlanMutation.mutate({ 
                planId: planToChangeTo,
                annual: isAnnual
            });
            setIsConfirmDialogOpen(false);
            setPlanToChangeTo(null);
        }
    };

    if (error) {
        return <p className="text-destructive">Error loading subscription details: {error.message}</p>;
    }

    return (
        <div className="space-y-8">
            {/* Billing Toggle */}
            {!isLoadingSubscription && (
                <div className="flex justify-end mb-4">
                    <div className="flex items-center space-x-2">
                        <Label htmlFor="billing-toggle" className="text-sm">Monthly</Label>
                        <Switch 
                            id="billing-toggle" 
                            checked={isAnnual} 
                            onCheckedChange={setIsAnnual}
                        />
                        <Label htmlFor="billing-toggle" className="text-sm font-medium">
                            Annual <span className="text-xs text-green-600 font-normal">(Save 20%)</span>
                        </Label>
                    </div>
                </div>
            )}

            {/* Pricing Cards Grid */}
            {!isLoadingSubscription && (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {plansData.map((plan) => {
                        const isCurrent = plan.id === currentPlanId && !isTrial;
                        let buttonText = "Choose Plan";
                        let buttonVariant: "default" | "outline" = "default";
                        let isDisabled = changePlanMutation.isPending || cancelPlanMutation.isPending;
                        
                        // Display price based on billing period
                        const displayPrice = isAnnual 
                            ? `$${parseInt(plan.price.replace('$', '')) * 10}/year` 
                            : `${plan.price}${plan.period}`;

                        if (isCurrent) {
                            buttonText = "Current Plan";
                            buttonVariant = "outline";
                            isDisabled = true;
                        } else if (plan.id === 'enterprise') {
                            buttonText = "Contact Sales";
                            buttonVariant = "outline";
                        } else {
                            // Determine if it's an upgrade or downgrade (optional)
                            // For simplicity, just show Choose Plan or Upgrade
                            buttonText = isTrial ? "Start Subscription" : "Change Plan";
                        }

                        return (
                            <Card 
                                key={plan.id}
                                className={cn(
                                    "flex flex-col transition-all", 
                                    isCurrent ? "border-primary ring-1 ring-primary" : "border-border",
                                    plan.isPopular ? "border-2" : "", // Add thicker border if popular
                                )}
                            >
                                {plan.isPopular && (
                                    <div className="absolute top-0 right-[-1px] bg-primary py-0.5 px-2 rounded-bl-md rounded-tr-md flex items-center z-10">
                                        <Star className="text-primary-foreground h-3 w-3 fill-current mr-1" />
                                        <span className="text-primary-foreground text-xs font-semibold">
                                            Popular
                                        </span>
                                    </div>
                                )}
                                <CardHeader className="pt-4">
                                    <CardTitle className="text-lg font-semibold">{plan.name}</CardTitle>
                                    <CardDescription className="flex items-baseline gap-1">
                                        <span className="text-3xl font-bold tracking-tight text-foreground">
                                            {plan.id !== 'enterprise' ? displayPrice : plan.price}
                                        </span>
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="flex-1 flex flex-col justify-between"> {/* Use flex to push button down */}
                                    <ul className="space-y-2 text-sm text-muted-foreground mb-6">
                                        {plan.features.map((feature, index) => (
                                            <li key={index} className="flex items-center gap-2">
                                                <Check className="size-4 shrink-0 text-green-600" />
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <Button 
                                        className="w-full mt-auto" // mt-auto pushes button down
                                        variant={buttonVariant}
                                        disabled={isDisabled}
                                        onClick={() => handleChangePlan(plan.id)}
                                    >
                                        {changePlanMutation.isPending && 
                                         changePlanMutation.variables?.planId === plan.id ? 
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null
                                        }
                                        {buttonText}
                                    </Button>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}

            {/* Loading Skeleton */}
            {isLoadingSubscription && (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {[...Array(3)].map((_, i) => (
                         <Card key={i} className="flex flex-col">
                             <CardHeader>
                                 <Skeleton className="h-6 w-24 mb-2" />
                                 <Skeleton className="h-8 w-16" />
                             </CardHeader>
                             <CardContent className="flex-1 flex flex-col justify-between">
                                 <div className="space-y-2 mb-6">
                                     {[...Array(4)].map((_, j) => <Skeleton key={j} className="h-4 w-full" />)}
                                 </div>
                                 <Skeleton className="h-10 w-full mt-auto" />
                             </CardContent>
                         </Card>
                    ))}
                </div>
            )}

            {/* Cancel Section */} 
            {!isLoadingSubscription && subscription && !isTrial && (
                <Card className="mt-8 border-destructive/50">
                    <CardHeader>
                        <CardTitle className="text-destructive text-lg">Cancel Subscription</CardTitle>
                        <CardDescription>
                            If you cancel, your plan will remain active until the end of the current billing period ({currentPeriodEnd ? currentPeriodEnd.toLocaleDateString() : 'N/A'}).
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button 
                            variant="destructive"
                            onClick={() => cancelPlanMutation.mutate()}
                            disabled={cancelPlanMutation.isPending}
                            className="w-full sm:w-auto"
                        >
                             {cancelPlanMutation.isPending ? 
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null
                            }
                            Cancel My Subscription
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* Confirm Dialog */}
            {isConfirmDialogOpen && (
                <div className="mt-8">
                    <Card className="border-destructive/50">
                        <CardHeader>
                            <CardTitle className="text-destructive text-lg">Confirm Plan Change</CardTitle>
                            <CardDescription>
                                Are you sure you want to change to the {planToChangeTo} plan?
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-end space-x-2">
                                <Button 
                                    variant="outline"
                                    onClick={() => setIsConfirmDialogOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    variant="destructive"
                                    onClick={confirmChangePlan}
                                >
                                    Confirm
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Payment Method Update Section */}
            {!isLoadingSubscription && subscription && subscription.status === 'active' && (
                <Card className="mt-8">
                    <CardHeader>
                        <CardTitle className="text-lg">Payment Method</CardTitle>
                        <CardDescription>
                            Update your payment information or view past invoices.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button 
                            variant="outline"
                            onClick={() => updatePaymentMutation.mutate()}
                            disabled={updatePaymentMutation.isPending}
                            className="w-full sm:w-auto"
                        >
                            {updatePaymentMutation.isPending ? 
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null
                            }
                            Manage Payment Details
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* Restore Subscription Section */}
            {!isLoadingSubscription && subscription && subscription.status === 'canceled' && (
                <Card className="mt-8 border-primary/50">
                    <CardHeader>
                        <CardTitle className="text-primary text-lg">Restore Subscription</CardTitle>
                        <CardDescription>
                            Your subscription is scheduled to end on {currentPeriodEnd ? currentPeriodEnd.toLocaleDateString() : 'N/A'}. 
                            You can restore your subscription to continue uninterrupted service.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button 
                            variant="default"
                            onClick={() => restoreSubscriptionMutation.mutate()}
                            disabled={restoreSubscriptionMutation.isPending}
                            className="w-full sm:w-auto"
                        >
                            {restoreSubscriptionMutation.isPending ? 
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null
                            }
                            Restore Subscription
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
} 