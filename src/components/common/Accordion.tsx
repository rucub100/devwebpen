/*
 * Copyright 2025 Ruslan Curbanov
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
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
    <div
      className={`flex flex-col h-full w-full overflow-hidden ${className}`}
      {...props}
    >
      {items.map((item, index) => (
        <details key={item.key} open={index === 0} className="overflow-auto">
          <summary className="cursor-pointer">{item.title}</summary>
          {item.content}
        </details>
      ))}
    </div>
  );
}
