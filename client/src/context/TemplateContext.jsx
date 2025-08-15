import React, { createContext, useContext, useReducer } from "react";
import { v4 as uuidv4 } from "uuid";

const TemplateContext = createContext(null);

const defaultPage = (img = "") => ({
  id: uuidv4(),
  imageDataUrl: img,
  width: 595,
  height: 842,
});
const initialState = {
  pages: [],
  fields: [],
  selectedPage:0,
  selectedFieldId: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "ADD_PAGE":
      return { ...state, pages: [...state.pages, defaultPage(action.payload)] };
    case "ADD_FIELD": {
      const f = {
        id: uuidv4(),
        type: action.payload.type,
        x: 40,
        y: 40,
        width: 160,
        height: 36,
        rotation: 0,
        fontSize: 14,
        fontFamily: "Helvetica",
        color: "#000000",
        text: action.payload.type === "text" ? "Text" : "",
        required: false,
        options: {},
        pageIndex: action.payload.pageIndex || 0,
      };
      return { ...state, fields: [...state.fields, f], selectedFieldId: f.id };
    }
    case "UPDATE_FIELD":
      return {
        ...state,
        fields: state.fields.map((f) =>
          f.id === action.payload.id ? { ...f, ...action.payload } : f
        ),
      };
    case "DELETE_FIELD":
      return {
        ...state,
        fields: state.fields.filter((f) => f.id !== action.payload),
        selectedFieldId: null,
      };
    case "SELECT_FIELD":
      return { ...state, selectedFieldId: action.payload };
    case "LOAD_TEMPLATE":
      return {
        pages:
          action.payload.pages && action.payload.pages.length
            ? action.payload.pages
            : [defaultPage()],
        fields: action.payload.fields || [],
        selectedFieldId: null,
      };
    default:
      return state;
  }
}

export function TemplateProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const addPage = (img) => dispatch({ type: "ADD_PAGE", payload: img });
  const addField = (type, pageIndex) =>
    dispatch({ type: "ADD_FIELD", payload: { type, pageIndex } });
  const updateField = (f) => dispatch({ type: "UPDATE_FIELD", payload: f });
  const deleteField = (id) => dispatch({ type: "DELETE_FIELD", payload: id });
  const selectField = (id) => dispatch({ type: "SELECT_FIELD", payload: id });
  const loadTemplate = (tpl) =>
    dispatch({ type: "LOAD_TEMPLATE", payload: tpl });
  const exportTemplate = () => ({ pages: state.pages, fields: state.fields });

  return (
    <TemplateContext.Provider
      value={{
        state,
        dispatch,
        addPage,
        addField,
        updateField,
        deleteField,
        selectField,
        loadTemplate,
        exportTemplate,
      }}
    >
      {children}
    </TemplateContext.Provider>
  );
}

export function useTemplate() {
  const ctx = useContext(TemplateContext);
  if (!ctx) throw new Error("useTemplate must be used inside TemplateProvider");
  return ctx;
}
