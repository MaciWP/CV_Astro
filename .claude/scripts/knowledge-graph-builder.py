import json
import os
from datetime import datetime

KNOWLEDGE_PATH = "C:\\Users\\Maci\\.gemini\\knowledge"
GRAPH_FILE = os.path.join(KNOWLEDGE_PATH, "graph.json")

class KnowledgeGraphBuilder:
    def __init__(self):
        self.graph = self._load_graph()

    def _load_graph(self):
        if os.path.exists(GRAPH_FILE):
            with open(GRAPH_FILE, 'r') as f:
                return json.load(f)
        return {"nodes": [], "edges": []}

    def add_event(self, event_type, context, outcome):
        """
        Log an event (e.g., Build Failure) and its outcome (e.g., Fixed by Agent X)
        """
        node_id = f"{event_type}_{datetime.now().isoformat()}"
        node = {
            "id": node_id,
            "type": event_type,
            "context": context,
            "outcome": outcome,
            "timestamp": datetime.now().isoformat()
        }
        self.graph["nodes"].append(node)
        self._save_graph()
        print(f"Indexed event: {node_id}")

    def query_similar_error(self, error_message):
        """
        Find previous solutions for similar errors (Simple keyword match for now)
        """
        matches = []
        for node in self.graph["nodes"]:
            if node["type"] == "error" and error_message in node["context"].get("message", ""):
                matches.append(node)
        return matches

    def _save_graph(self):
        os.makedirs(KNOWLEDGE_PATH, exist_ok=True)
        with open(GRAPH_FILE, 'w') as f:
            json.dump(self.graph, f, indent=2)

if __name__ == "__main__":
    # Example usage
    kb = KnowledgeGraphBuilder()
    kb.add_event("build_error", {"message": "Hydration failed"}, {"agent": "astro-islands-optimizer", "success": True})
