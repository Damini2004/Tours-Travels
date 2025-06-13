
"use client"

import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDown } from "lucide-react" // Using ChevronDown as is common in ShadCN

import { cn } from "@/lib/utils"

const Collapsible = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Root>,
  Omit<React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Root>, "value" | "onValueChange" | "type" | "collapsible"> & {
    open?: boolean
    defaultOpen?: boolean
    onOpenChange?: (open: boolean) => void
  }
>(({ className, children, open: openProp, defaultOpen, onOpenChange, ...props }, ref) => {
  const [isOpen, setIsOpen] = React.useState(defaultOpen ?? false)
  const uniqueId = React.useId ? React.useId() : "collapsible-item"; // Fallback for older React if useId is not avail

  // Controlled component: If openProp is provided, it takes precedence
  React.useEffect(() => {
    if (openProp !== undefined) {
      setIsOpen(openProp)
    }
  }, [openProp])

  const handleValueChange = (value: string) => {
    const newOpenState = value === uniqueId
    if (openProp === undefined) { // Only update internal state if not controlled
      setIsOpen(newOpenState)
    }
    onOpenChange?.(newOpenState)
  }

  const accordionValue = isOpen ? uniqueId : ""

  return (
    <AccordionPrimitive.Root
      ref={ref}
      type="single"
      collapsible
      className={cn(className)}
      value={accordionValue}
      onValueChange={handleValueChange}
      {...props}
    >
      <AccordionPrimitive.Item value={uniqueId} className="border-none"> 
        {/* Children (Trigger and Content) will be rendered here, inside the Item */}
        {children}
      </AccordionPrimitive.Item>
    </AccordionPrimitive.Root>
  )
})
Collapsible.displayName = "Collapsible"

const CollapsibleTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
))
CollapsibleTrigger.displayName = AccordionPrimitive.Trigger.displayName

const CollapsibleContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className={cn(
      "overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
      className
    )}
    {...props}
  >
    <div className={cn("pb-4 pt-0", className)}>{children}</div>
  </AccordionPrimitive.Content>
))
CollapsibleContent.displayName = AccordionPrimitive.Content.displayName

// CollapsibleItem is part of the standard Accordion, but for a single Collapsible,
// the root Collapsible component handles the Item internally.
// Keeping the export for consistency if it's used elsewhere, though it's not typical for this pattern.
const CollapsibleItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn("border-b", className)} // Default ShadCN styling
    {...props}
  />
));
CollapsibleItem.displayName = "CollapsibleItem";


export { Collapsible, CollapsibleTrigger, CollapsibleContent, CollapsibleItem }
