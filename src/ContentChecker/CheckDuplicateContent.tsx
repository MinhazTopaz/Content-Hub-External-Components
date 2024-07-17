import React, { FunctionComponent, useEffect, useState } from "react";

interface IContent {
  contentId: number;
  contentName: string;
}

const CheckDuplicateContent: FunctionComponent = ({}) => {
  const [body, setBody] = useState<string>("Gathering Content");
  const serverName = window.location.hostname;

  var contentArray: Array<IContent> = [];
  var returnText: string = "";

  useEffect(() => {
    const getList = async () => {
      let query = "Definition.Name=='M.Content'";

      let mDotContents =
        "https://" + serverName + "/api/entities/query?query=" + query;

      await GetContent(mDotContents, contentArray).then((response) => {
          console.log("done looping");
          console.log(contentArray);
      });

      contentArray.forEach((content) => {
        returnText +=
          "<a href='https://" +
          serverName +
          "/Pages/en-US/ContentDetail/" +
          content.contentId +
          "' target='_blank'> " +
          content.contentName +
          " </a>" +
          "<br />";
      });

      setBody(returnText);
    };

    getList();
  }, []);

  return <div dangerouslySetInnerHTML={{ __html: body }} />;
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

export default CheckDuplicateContent;
