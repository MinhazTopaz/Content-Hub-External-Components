import React, { FunctionComponent, useEffect, useState } from "react";

interface IContent {
  contentId: number;
  contentName: string;
}

const CheckDuplicateContent: FunctionComponent = ({}) => {
  const [body, setBody] = useState<string>("Gathering all M.Content.");
  const [content, setContent] = useState<Array<IContent>>([]);
  const serverName = window.location.hostname;

  var contentArray: Array<IContent> = [];

  useEffect(() => {
    const getList = async () => {
      let query = "Definition.Name=='M.Content'";

      let mDotContents =
        "https://" + serverName + "/api/entities/query?query=" + query;
      setBody("Calculating duplicates.");
      await GetContent(mDotContents, contentArray).then((response) => {
        console.log("done looping");
        //console.log(contentArray);
      });

      setBody("Generating list...");
      const duplicates = findDuplicates(contentArray);
      console.log(duplicates);

      setContent(duplicates);
      setBody("");
      // duplicates.forEach((content) => {
      //   returnText +=
      //     "<a href='https://" +
      //     serverName +
      //     "/Pages/en-US/ContentDetail/" +
      //     content.contentId +
      //     "' target='_blank'> " +
      //     content.contentName +
      //     " </a>" +
      //     "<br />";
      // });

      // setBody(returnText);
    };

    getList();
  }, []);

  //return <div dangerouslySetInnerHTML={{ __html: body }} />;
  return (
    <>
    <h1>M.Content with duplicate names:</h1>
      <div>{body}</div>
      <ul>
        {content.map((item, index) => (
          <li key={index}>
            <a
              href={
                "https://" +
                serverName +
                "/Pages/en-US/ContentDetail/" +
                item.contentId
              }
              target="_blank"
            >
              {item.contentName}
            </a>
          </li>
        ))}
      </ul>
    </>
  );
};

const GetContent = async (
  nextUrl: string,
  contentArray: Array<IContent>
): Promise<Array<IContent>> => {
  delay(1000);

  await fetch(nextUrl)
    .then((resp) => resp.json())
    .then(async function (linkItems) {
      console.log(linkItems);
      if (linkItems == null || linkItems.items.count == 0) {
        return;
      }

      linkItems.items.forEach(function (item: any) {
        contentArray.push({
          contentId: item.id,
          contentName: item.properties["Content.Name"],
        });
      });

      console.log(linkItems.next);
      console.log(contentArray.length);

      if (linkItems.next) {
        let nextLink: string = linkItems.next.href;
        console.log(nextLink);

        if (nextLink) {
          console.log(nextLink);
          await GetContent(linkItems.next.href, contentArray);
        }
      }
    });

  return contentArray;
};

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function findDuplicates(contents: IContent[]): IContent[] {
  const contentMap = new Map<string, IContent[]>();
  const duplicates: IContent[] = [];

  for (const content of contents) {
    if (contentMap.has(content.contentName)) {
      contentMap.get(content.contentName)!.push(content);
    } else {
      contentMap.set(content.contentName, [content]);
    }
  }

  for (const items of contentMap.values()) {
    if (items.length > 1) {
      duplicates.push(...items);
    }
  }

  return duplicates;
}

export default CheckDuplicateContent;
