import { useEffect } from "react";
import {
  useExtensionApi,
  render,
  Banner,
  useApplyAttributeChange,
  TextField,
} from "@shopify/checkout-ui-extensions-react";

render("Checkout::Reductions::RenderBefore", () => <App />);
render("Checkout::Dynamic::Render", () => <App />);

function App() {
  const data = useExtensionApi();
  const updateAttribute = useApplyAttributeChange();

  useEffect(() => {
    async function queryApi() {
      // Request a new (or cached) session token from Shopify
      const token = await data.sessionToken.get();
      console.log("sessionToken.get()", token);

      const apiResponse = await fetchWithToken(token);
      // Use your response
      console.log("API response", apiResponse);
    }

    function fetchWithToken(token: string) {
      const result = fetch("https://myapp.com/api/session-token", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return result;
    }

    queryApi();
  }, [data.sessionToken]);

  async function onCheckboxChange(v: string) {
    try {
      await updateAttribute({
        type: "updateAttribute",
        key: "ATTRIBUTE_KEY",
        value: v,
      });
    } catch (error) {
      console.log(error, "error attr");
    }
  }

  console.log(data, data.sessionToken.get(), "extension api");

  // console.log(targets, "targets");
  return (
    <Banner>
      Checkout Points User .
      <TextField
        label="Discount"
        onChange={(e: string) => onCheckboxChange(e)}
      />
    </Banner>
  );
}
