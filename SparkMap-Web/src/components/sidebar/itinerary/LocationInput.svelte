<script>
    export let placeholderText;
    export let lat;
    export let lon;

    let searchQuery;
    let suggestions = [];

    // Fonction pour rechercher des lieux via Nominatim avec debounce
    let debounceTimeout;
    function handleSearchInput() {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(async () => {
            if (searchQuery.length > 2) {
                const res = await fetch(
                    `https://nominatim.openstreetmap.org/search?format=json&q=${searchQuery}`,
                );
                suggestions = await res.json();
            } else {
                suggestions = [];
            }
        }, 500);
    }

    // Fonction pour sélectionner un lieu et sauvegarder son nom et ses coordonnées
    function selectLocation(location) {
        searchQuery = location.display_name;
        lat = location.lat;
        lon = location.lon;
        suggestions = [];
    }
</script>

<input
    type="text"
    bind:value={searchQuery}
    placeholder={placeholderText}
    autocomplete="off"
    on:input={handleSearchInput}
/>

{#if suggestions.length > 0}
    <ul class="suggestions">
        {#each suggestions as suggestion}
            <li class="suggestion-item" on:click={() => selectLocation(suggestion)}> {suggestion.display_name} </li>
        {/each}
    </ul>
{/if}

<style>
    input {
        height: 32px;
        padding: 8px;
        font-size: 1rem;
        color: #dee2e6;
        background-color: #212529;
        border: 1px solid #495057;
        border-radius: 8px;
        outline: none;
    }
    
    .suggestions {
        list-style: none;
        margin: 0;
        max-height: 200px;
        overflow-y: auto;

        padding: 8px;
        font-size: 1rem;
        color: #dee2e6;
        background-color: #212529;
        border: 1px solid #495057;
        border-radius: 8px;
    }

    .suggestion-item {
        padding: 8px;
        cursor: pointer;
    }

    .suggestion-item:hover {
        color: #fc9047;
    }
</style>