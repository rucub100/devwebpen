import { useApiClient } from "../../hooks/useApiClient";
import Accordion, { AccordionItem } from "../common/Accordion";
import Button from "../common/Button";

export default function NavApiClient() {
  const { apiClient, newApiClientRequest, openApiClientRequest } = useApiClient(
    {
      listenApiClient: true,
    }
  );

  const collections: AccordionItem[] = apiClient.collections.map(
    (collection) => {
      const collectionItem: AccordionItem = {
        key: collection.name,
        title: collection.name,
        content: (
          <div className="flex flex-col p-4 gap-2 text-neutral-300">
            <Button onClick={() => newApiClientRequest(collection.name)}>
              Add Request
            </Button>
            {collection.requests.map((request) => (
              <div
                key={request.id}
                className="w-full cursor-pointer hover:bg-neutral-800 p-1 rounded"
                onClick={() => openApiClientRequest(request.id)}
              >
                {request.method}
              </div>
            ))}
          </div>
        ),
      };

      return collectionItem;
    }
  );

  const items: AccordionItem[] = [...collections];

  return <Accordion className="p-1 min-w-[200px]" items={items} />;
}
