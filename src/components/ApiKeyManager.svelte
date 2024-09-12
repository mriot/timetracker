<script lang="ts">
    import { apiKeyStore } from "../stores/store";

    let newApiKey = "";
    let newKeyUrl = "";
</script>

<details class="dropdown">
    <summary>API-Keys ({$apiKeyStore.length})</summary>

    <ul>
        {#each $apiKeyStore as { key, url }}
            <li>
                <fieldset role="group" data-tooltip={key}>
                    <input type="text" readonly value={url} />
                    <input
                        type="button"
                        value="Remove"
                        on:click={() => {
                            confirm(`Delete key for ${url}?`) &&
                                apiKeyStore.update((keys) => keys.filter((k) => k.key !== key));
                        }}
                    />
                </fieldset>
            </li>
        {/each}
        <li>
            <span>Add a new API key</span>
        </li>
        <li>
            <fieldset role="group">
                <input type="text" placeholder="Your key" bind:value={newApiKey} />
                <input type="text" placeholder="OpenProject url" bind:value={newKeyUrl} />
                <input
                    type="button"
                    value="Save"
                    on:click={() => {
                        apiKeyStore.update((keys) => [...keys, { key: newApiKey, url: newKeyUrl }]);
                        newApiKey = "";
                        newKeyUrl = "";
                    }}
                />
            </fieldset>
        </li>
    </ul>
</details>
