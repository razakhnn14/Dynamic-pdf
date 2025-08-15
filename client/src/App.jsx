import React, { useState, useRef, useEffect } from "react";
import Toolbar from "./components/Toolbar";
import PageThumbnails from "./components/PageThumbnails";
import CanvasEditor from "./components/CanvasEditor";
import ExportPanel from "./components/ExportPanel";
import { useTemplate } from "./context/TemplateContext";

export default function App() {
  const {
    state,
    addPage,
    addField,
    deleteField,
    exportTemplate,
    loadTemplate,
  } = useTemplate();
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const fileInputRef = useRef();
  const [templatesList, setTemplatesList] = useState([]);
  const serverBase = "http://localhost:4000"; 
  useEffect(() => {
    fetchTemplatesList();
  }, []);

  async function fetchTemplatesList() {
    try {
      const res = await fetch(`${serverBase}/templates`);
      const list = await res.json();
      setTemplatesList(list);
    } catch (err) {
      console.error(err);
    }
  }

  function handleUploadPage(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      addPage(reader.result);
      setCurrentPageIndex(state.pages.length);
    };
    reader.readAsDataURL(f);
    e.target.value = "";
  }

  async function saveTemplateToServer(title = "Untitled") {
    const payload = { title, pages: state.pages, fields: state.fields };
    const res = await fetch(`${serverBase}/templates`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Save failed");
    const json = await res.json();
    await fetchTemplatesList();
    return json.id;
  }

  async function loadTemplateFromServer(id) {
    const res = await fetch(`${serverBase}/templates/${id}`);
    if (!res.ok) {
      alert("Failed to load");
      return;
    }
    const json = await res.json();
    loadTemplate(json.template);
    setCurrentPageIndex(0);
  }

  return (
    <div className="min-h-screen flex gap-4 p-4">
      <aside className="w-72 bg-white rounded shadow p-4 flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Pages</h2>
        <div className="flex flex-col gap-2 overflow-auto">
          <PageThumbnails
            pages={state.pages}
            currentIndex={currentPageIndex}
            onSelect={setCurrentPageIndex}
          />
        </div>

        <div className="flex gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleUploadPage}
          />
          <button
            className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg cursor-pointer"
            onClick={() => fileInputRef.current.click()}
          >
            Upload Page
          </button>
          <button
            className="px-3 py-2 bg-gray-300 rounded-lg cursor-pointer hover:bg-gray-200"
            onClick={() => addPage("")}
          >
            Blank Page
          </button>

        </div>

        <div>
          <h3 className="font-medium">Template JSON</h3>
          <div className="flex gap-2 mt-2">
            <button
              className="px-3 py-2 bg-blue-600 cursor-pointer hover:bg-blue-500 text-white rounded-lg"
              onClick={() => {
                const tpl = { pages: state.pages, fields: state.fields };
                const blob = new Blob([JSON.stringify(tpl, null, 2)], {
                  type: "application/json",
                });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "template.json";
                a.click();
                URL.revokeObjectURL(url);
              }}
            >
              Export JSON
            </button>
            <label className="px-3 py-2 bg-gray-300 rounded-lg cursor-pointer hover:bg-gray-200">
              Load JSON
              <input
                type="file"
                accept="application/json"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const text = await file.text();
                  try {
                    const tpl = JSON.parse(text);
                    loadTemplate(tpl);
                    setCurrentPageIndex(0);
                  } catch (err) {
                    alert("Invalid JSON");
                  }
                  e.target.value = "";
                }}
              />
            </label>
          </div>
        </div>
        <div>
          <h3 className="font-medium">Server Templates</h3>
          <div className="flex flex-col gap-2 max-h-48 overflow-auto">
            {templatesList.length === 0 && (
              <div className="text-sm text-gray-500">No saved templates</div>
            )}
            {templatesList.map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between p-2 border rounded"
              >
                <div>
                  <div className="text-sm font-medium">
                    {t.title || "Untitled"}
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(t.updatedAt).toLocaleString()}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <button
                    className="text-sm text-blue-600"
                    onClick={() => loadTemplateFromServer(t.id)}
                  >
                    Load
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-2 flex gap-2">
            <button
              className="px-3 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg cursor-pointer text-white"
              onClick={async () => {
                try {
                  const id = await saveTemplateToServer(
                    prompt("Save as (title):", "Untitled template") ||
                      "Untitled template"
                  );
                  alert("Saved with id: " + id);
                  fetchTemplatesList();
                } catch (err) {
                  console.error(err);
                  alert("Save failed");
                }
              }}
            >
              Save to server
            </button>
          </div>
        </div>

        <div>
          <ExportPanel
            getTemplate={() => ({ pages: state.pages, fields: state.fields })}
          />
        </div>
      </aside>

      <main className="flex-1 flex flex-col gap-4">
        <Toolbar
          onAddField={(type) => addField(type, currentPageIndex)}
          onDeleteField={() => deleteField(state.selectedFieldId)}
          selectedFieldId={state.selectedFieldId}
        />

        <div className="flex-1 bg-white rounded shadow p-4 overflow-auto flex justify-center items-start">
          <CanvasEditor
            page={state.pages[currentPageIndex]}
            fields={state.fields}
            pageIndex={currentPageIndex}
            selectedFieldId={state.selectedFieldId}
            dispatch={null /* components will use context for updates */}
          />
        </div>
      </main>
    </div>
  );
}
