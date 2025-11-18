<script lang="ts">
  import { Toaster } from "svelte-french-toast";
  import CounterpartiesPage from "./pages/counterparties/ui/CounterpartiesPage.svelte";
  import CreateTransactionPage from "./pages/create-transaction/ui/CreateTransactionPage.svelte";
  import HistoryPage from "./pages/history/ui/HistoryPage.svelte";
  import InboxPage from "./pages/inbox/ui/InboxPage.svelte";

  let currentPage = $state("inbox");

  function handleCreateSuccess() {
    currentPage = "inbox";
  }

  function handlePageChange(newPage: string) {
    currentPage = newPage;
  }
</script>

<div class="app">
  <nav class="navbar">
    <div class="nav-brand">
      <h1>Transaction Manager</h1>
    </div>
    <div class="nav-links">
      <button
        class="nav-link"
        class:active={currentPage === "inbox"}
        onclick={() => handlePageChange("inbox")}
      >
        Inbox
      </button>
      <button
        class="nav-link"
        class:active={currentPage === "history"}
        onclick={() => handlePageChange("history")}
      >
        History
      </button>
      <button
        class="nav-link"
        class:active={currentPage === "counterparties"}
        onclick={() => handlePageChange("counterparties")}
      >
        Counterparties
      </button>
    </div>
  </nav>

  <main class="main-content">
    <div class="page-content">
      {#if currentPage === "inbox"}
        <InboxPage onCreateTransaction={() => handlePageChange("create")} />
      {:else if currentPage === "history"}
        <HistoryPage />
      {:else if currentPage === "counterparties"}
        <CounterpartiesPage />
      {:else if currentPage === "create"}
        <CreateTransactionPage onsuccess={handleCreateSuccess} />
      {/if}
    </div>
  </main>
</div>

<Toaster />

<style>
  :global(body) {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
      Ubuntu, Cantarell, sans-serif;
    background: #f5f5f5;
  }

  .app {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .navbar {
    background: white;
    padding: 1rem 2rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .nav-brand h1 {
    margin: 0;
    color: #ff3e00;
    font-size: 1.5rem;
  }

  .nav-links {
    display: flex;
    gap: 0.5rem;
  }

  .nav-link {
    padding: 0.5rem 1rem;
    border: none;
    background: transparent;
    color: #666;
    cursor: pointer;
    border-radius: 4px;
    transition: all 0.2s;
    font-size: 1rem;
  }

  .nav-link:hover {
    background: #f0f0f0;
    color: #333;
  }

  .nav-link.active {
    background: #ff3e00;
    color: white;
  }

  .main-content {
    flex: 1;
    display: flex;
    gap: 2rem;
    padding: 2rem;
    max-width: 1400px;
    margin: 0 auto;
    width: 100%;
  }

  .page-content {
    flex: 1;
    min-width: 0;
  }

  @media (max-width: 768px) {
    .main-content {
      flex-direction: column;
    }
  }
</style>
