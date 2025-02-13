import { HTMLAttributes, ReactNode } from "react";

export interface AccordionItem {
  key: string;
  title: string;
  content: ReactNode;
}

interface AccordionProps extends HTMLAttributes<HTMLDivElement> {
  items: Array<AccordionItem>;
}

export default function Accordion({
  items,
  className,
  ...props
}: AccordionProps) {
  return (
    <div className={`h-full w-full overflow-hidden ${className}`} {...props}>
      {items.map((item, index) => (
        <details key={item.key} open={index === 0}>
          <summary className="cursor-pointer">{item.title}</summary>
          {item.content}
        </details>
      ))}
    </div>
  );
}
