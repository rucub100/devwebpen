import Accordion, { AccordionItem } from "../common/Accordion";

export default function NavProxy() {
  const listenerItem: AccordionItem = {
    key: "listener",
    title: "Listener",
    content: (
      <div className="flex flex-col p-4 gap-2 text-neutral-300">
        <p>Port:</p>
      </div>
    ),
  };

  const items: AccordionItem[] = [listenerItem];

  return <Accordion className="p-1 min-w-[200px]" items={items} />;
}
