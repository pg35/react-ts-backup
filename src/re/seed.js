export const seed = {
  config: {
    ui: {
      screens: [
        {
          id: "inquiry",
          label: "Inqury",
          desc: "this is a long desc of inquiry screen",
          default: {
            fields: {
              active: true,
              label: "this is label",
              desc: "this is public desc",
              pricing: {
                method: 1,
                details: { type: 1, value: 0.5 }
              }
            },
            products: { items: {}, itemOrder: [] },
            criteria: { items: {}, itemOrder: [] }
          },
          sections: {
            fields: {
              id: "fields",
              component: "InquiryFields"
            },
            products: {
              id: "products",
              label: "Select Product",
              component: "ConditionList",
              keyGroupIds: ["product"],
              defaultItem: { keyId: 1, opId: 1, value: null }
            },
            criteria: {
              id: "criteria",
              label: "Select Criteria",
              component: "ConditionList",
              keyGroupIds: ["product"],
              defaultItem: { keyId: 2, opId: 3, value: null }
            }
          }
        }
      ]
    },
    meta: {
      keys: {
        1: { name: "Id", opIds: [1, 2] },
        2: { name: "Tag", opIds: [3, 4] }
      },
      operators: {
        1: { name: "In" },
        2: { name: "Not in" },
        3: { name: "=" },
        4: { name: "!=" }
      },
      keyGroups: {
        product: { name: "Product", keyIds: [1, 2] }
      },
      prcing: {
        1: { name: "Simple adjustment", default: { type: 1, value: "" } },
        2: { name: "Bulk", default: [{ from: "", to: "", type: 1, value: "" }] }
      },
      pricingGroups: {
        simple: { name: "Simple", pricings: [1] },
        volumn: { name: "Volumn", pricings: [2] }
      }
    }
  },
  rules: {
    inquiry: {
      items: {
        1: {
          id: 1,
          fields: {
            active: true,
            label: "hello",
            desc: "hello city",
            pricing: { method: "simple", details: { type: 1, value: 0.2 } }
          },
          products: {
            items: { 1: { id: 1, keyId: 1, opId: 1, value: null } },
            itemOrder: [1]
          },
          criteria: {
            items: {
              1: { id: 1, keyId: 2, opId: 4, value: null },
              2: { id: 2, keyId: 1, opId: 1, value: null }
            },
            itemOrder: [1, 2]
          }
        },
        2: {
          id: 2,
          fields: {
            active: true,
            label: "hello2",
            desc: "hello city2",
            pricing: { method: "bulk", details: { type: 1, value: 0.5 } }
          },
          products: {
            items: { 1: { id: 1, keyId: 1, opId: 1, value: null } },
            itemOrder: [1]
          },
          criteria: {
            items: {
              1: { id: 1, keyId: 2, opId: 4, value: null },
              2: { id: 2, keyId: 1, opId: 1, value: null }
            },
            itemOrder: [1, 2]
          }
        }
      },
      itemOrder: [1, 2],
      selected: 1
    }
  },
  nextId: 3
};
