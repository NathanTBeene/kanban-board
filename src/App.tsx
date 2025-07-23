import Board from "./components/Board";
import type { BoardData } from "./lib/data/types";

const testBoardData: BoardData = {
  id: 1,
  columns: [
    {
      id: "column-todo",
      title: "To Do",
      items: [
        { id: "entry-101", description: "Set up project structure" },
        { id: "entry-102", description: "Design board layout" },
      ],
    },
    {
      id: "column-in-progress",
      title: "In Progress",
      items: [
        { id: "entry-201", description: "Implement column component" },
      ],
    },
    {
      id: "column-done",
      title: "Done",
      items: [
        { id: "entry-301", description: "Initialize repository" },
      ],
    },
  ],
};

function App() {

  return (
    <div className="App">
      <Board initialBoard={testBoardData} />
    </div>
  );
}

export default App;
