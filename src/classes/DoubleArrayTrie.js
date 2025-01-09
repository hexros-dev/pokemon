class DoubleArrayTrie {
	constructor() {
		this.nodes = new Map();
		this.text = new Map();
		this.size = 0;
		this.createNode('');
	}

	createNode(text) {
		const nodeId = this.size++;
		this.nodes.set(nodeId, new Map());
		this.text.set(nodeId, text);
		return nodeId;
	}

	insert(word) {
		let current = 0;
		for (const char of word) {
			const children = this.nodes.get(current);

			if (!children.has(char)) {
				const newNodeId = this.createNode(
					this.text.get(current) + char,
				);
				children.set(char, newNodeId);
			}

			current = children.get(char);
		}
	}

	insertFromJSON(jsonData) {
		for (const key in jsonData) {
			if (jsonData.hasOwnProperty(key)) {
				this.insert(key);
			}
		}
	}

	search(word) {
		let current = 0;
		for (const char of word) {
			const children = this.nodes.get(current);
			if (!children.has(char)) {
				return false;
			}
			current = children.get(char);
		}
		return true;
	}

	toGraphJSON() {
		const nodes = [];
		const edges = [];

		for (const [nodeId, children] of this.nodes.entries()) {
			nodes.push({
				id: nodeId,
				label: `Node ${nodeId}: "${this.text.get(nodeId)}"`,
			});

			for (const [char, childId] of children.entries()) {
				edges.push({
					from: nodeId,
					to: childId,
					label: `char: ${char}`,
				});
			}
		}

		return { nodes, edges };
	}
	startsWithPrefix(prefix) {
		let current = 0;

		// Duyệt qua từng ký tự trong prefix
		for (const char of prefix) {
			const children = this.nodes.get(current);

			// Kiểm tra xem có con nào có ký tự này không
			if (!children.has(char)) {
				return false; // Nếu không có con nào có ký tự này, trả về false
			}

			// Di chuyển đến node tiếp theo
			current = children.get(char);
		}

		// Nếu đã duyệt hết prefix mà không gặp lỗi, trả về true
		return true;
	}
}

export default DoubleArrayTrie;
