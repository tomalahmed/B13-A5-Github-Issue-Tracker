document.addEventListener("DOMContentLoaded", () => {
  const loadingSpinner = document.getElementById("loadingSpinner");
  const issueCardsContainer = document.getElementById("issueCardsContainer");
  const issueCount = document.getElementById("issueCount");
  const tabsContainer = document.getElementById("tabsContainer");
  const tabButtons = tabsContainer.querySelectorAll("button");
  const emptyState = document.getElementById("emptyState");
  const errorState = document.getElementById("errorState");
  const issueModal = document.getElementById("issueModal");
  const modalBackdrop = document.getElementById("modalBackdrop");
  const closeModalBtn = document.getElementById("closeModalBtn");

  let allIssues = [];
  let currentTab = "all";
  let searchQuery = "";

  const setLoading = (on = true) => {
    if (on) {
      loadingSpinner.classList.remove("hidden");
      loadingSpinner.classList.add("flex");
      issueCardsContainer.classList.add("hidden");
      issueCardsContainer.classList.remove("grid");
      emptyState.classList.add("hidden");
      errorState.classList.add("hidden");
    } else {
      loadingSpinner.classList.add("hidden");
      loadingSpinner.classList.remove("flex");
    }
  };

  const fetchIssues = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues");
      const json = await res.json();
      allIssues = json?.data || [];
      renderIssues();
    } catch (error) {
      setLoading(false);
      errorState.classList.remove("hidden");
      document.getElementById("errorMessage").textContent = "Failed to load issues.";
    }
  };
  const getPriorityColor = (priority) => {
    if (priority.toLowerCase() === "high") return "bg-red-500";
    if (priority.toLowerCase() === "medium") return "bg-orange-400";
    return "bg-gray-400";
  };

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

  const renderIssues = () => {
    setLoading(false);
    const filteredIssues = allIssues.filter(issue => {
      // Search Filter
      const matchesSearch = searchQuery === "" ||
        issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.description.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (currentTab === "all") return true;
      return issue.status.toLowerCase() === currentTab;
    });

    issueCount.textContent = filteredIssues.length;
    issueCardsContainer.innerHTML = "";

    if (filteredIssues.length === 0) {
      emptyState.classList.remove("hidden");
      issueCardsContainer.classList.add("hidden");
      issueCardsContainer.classList.remove("grid");
      return;
    }

    emptyState.classList.add("hidden");
    issueCardsContainer.classList.remove("hidden");
    issueCardsContainer.classList.add("grid");

    filteredIssues.forEach(issue => {
      const isOpen = issue.status.toLowerCase() === "open";
      const card = document.createElement("div");

      card.className = `bg-white rounded-lg shadow-sm border border-gray-200 ${isOpen ? "border-open" : "border-closed"} p-5 flex flex-col gap-4 cursor-pointer hover:shadow-md transition-shadow`;

      card.dataset.id = issue.id;

      const labelsHtml = (issue.labels || []).map(label => {
        return `<span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${getLabelColorText(label)} uppercase tracking-wider">
                    ${label}
                </span>`;
      }).join("");

      const openIconImg = `<img src="./assets/Open-Status.png" alt="Open" class="w-5 h-5">`;
      const closedIconImg = `<img src="./assets/Closed- Status.png" alt="Closed" class="w-5 h-5">`;

      card.innerHTML = `
                <div class="flex justify-between items-start">
                    <div class="flex items-center gap-2">
                        ${isOpen ? openIconImg : closedIconImg}
                    </div>
                    <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getPriorityColorText(issue.priority)}">
                        ${issue.priority}
                    </span>
                </div>
                <div class="flex-grow">
                    <h3 class="font-semibold text-gray-900 leading-tight">${issue.title}</h3>
                    <p class="text-sm text-gray-500 mt-2 line-clamp-2">${issue.description}</p>
                </div>
                <div class="flex flex-wrap gap-2">
                    ${labelsHtml}
                </div>
                <div class="border-t border-gray-100 mt-2 pt-4 flex justify-between items-center text-xs text-gray-400 font-medium">
                    <span>#${issue.id} by ${issue.author}</span>
                    <span>${formatDate(issue.createdAt)}</span>
                </div>
            `;
      
      issueCardsContainer.appendChild(card);
    });
  };

  tabButtons.forEach(btn => {
    btn.addEventListener("click", (e) => {
      currentTab = e.target.dataset.tab;

      tabButtons.forEach(b => {
        b.classList.remove("tab-active", "bg-[#4A00FF]", "text-white");
        b.classList.add("tab-inactive", "text-gray-600", "bg-white", "hover:bg-gray-50");
        if (b.dataset.tab === currentTab) {
          b.classList.add("tab-active", "bg-[#4A00FF]", "text-white");
          b.classList.remove("tab-inactive", "text-gray-600", "bg-white", "hover:bg-gray-50");
        }
      });

      renderIssues();
    });
  });

  tabButtons.forEach(b => {
    if (b.dataset.tab !== currentTab) {
      b.classList.add("text-gray-600", "bg-white", "hover:bg-gray-50");
    }
  });

  // Search Logic
  const searchInput = document.getElementById("searchInput");
  const searchBtn = document.getElementById("searchBtn");

  const performSearch = () => {
    searchQuery = searchInput.value.trim();
    renderIssues();
  };

  searchBtn.addEventListener("click", performSearch);
  searchInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
      performSearch();
    }
  });

  fetchIssues();
});
