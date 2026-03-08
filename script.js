document.addEventListener("DOMContentLoaded", () => {
    const issueCardsContainer = document.getElementById("issueCardsContainer");
    const issueModal = document.getElementById("issueModal");
    const modalBackdrop = document.getElementById("modalBackdrop");
    const closeModalBtn = document.getElementById("closeModalBtn");
    const modalLoader = document.getElementById("modalLoader");
    const modalContentWrapper = document.getElementById("modalContentWrapper");
    
    const setModalLoading = (on = true) => {
        if (on) {
            modalLoader.classList.remove("hidden");
            modalContentWrapper.classList.add("opacity-0", "pointer-events-none");
        } else {
            modalLoader.classList.add("hidden");
            modalContentWrapper.classList.remove("opacity-0", "pointer-events-none");
        }
    };

    const closeModal = () => {
        issueModal.classList.add("hidden");
    };

    modalBackdrop.addEventListener("click", closeModal);
    closeModalBtn.addEventListener("click", closeModal);

    const getPriorityColorText = (priority) => {
        if (priority.toLowerCase() === "high") return "bg-red-50 text-red-500 border-red-100";
        if (priority.toLowerCase() === "medium") return "bg-orange-50 text-orange-500 border-orange-100";
        return "bg-gray-50 text-gray-500 border-gray-200";
    };

    const getLabelColorText = (label) => {
        const lbl = label.toLowerCase();
        if (lbl === 'bug') return "bg-red-50 text-red-500 border-red-100";
        if (lbl === 'help wanted') return "bg-orange-50 text-orange-500 border-orange-100";
        if (lbl === 'enhancement') return "bg-green-50 text-[#00A96E] border-green-100";
        return "bg-gray-50 text-gray-500 border-gray-100";
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US');
    };

    issueCardsContainer.addEventListener("click", (e) => {
        const target = e.target.closest("[data-id]");
        if (!target) return;

        const id = target.dataset.id;
        if (!id) return;

        issueModal.classList.remove("hidden");

        setModalLoading(true);

        fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`)
            .then((res) => res.json())
            .then((json) => {
                if (json?.status !== "success" || !json?.data) {
                    alert("Failed to fetch issue data");
                    closeModal();
                    return;
                }
                const issue = json.data;

                document.getElementById("modalTitle").textContent = issue.title;

                const statusBadge = document.getElementById("modalStatusBadge");
                statusBadge.textContent = issue.status === "open" ? "Opened" : "Closed";
                statusBadge.className = `inline-flex items-center px-2 py-0.5 rounded text-xs font-medium text-white ${issue.status === "open" ? "bg-[#00A96E]" : "bg-[#A855F7]"}`;

                document.getElementById("modalAuthor").textContent = issue.author;
                document.getElementById("modalDate").textContent = formatDate(issue.createdAt);

                const labelsContainer = document.getElementById("modalLabels");
                labelsContainer.innerHTML = (issue.labels || []).map(label => {
                    return `<span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${getLabelColorText(label)} uppercase tracking-wider">
                        ${label}
                    </span>`;
                }).join("");

                document.getElementById("modalDescription").textContent = issue.description;
                document.getElementById("modalAssignee").textContent = issue.assignee || "Unassigned";

                const priorityBadge = document.getElementById("modalPriority");
                priorityBadge.textContent = issue.priority.toUpperCase();
                priorityBadge.className = `inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getPriorityColorText(issue.priority)}`;

            })
            .catch(() => {
                alert("Failed to load issue");
                closeModal();
            })
            .finally(() => {
                setModalLoading(false);
            });
    });
});
