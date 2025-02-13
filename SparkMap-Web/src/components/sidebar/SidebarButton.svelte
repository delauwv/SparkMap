<script>
    export let buttonText;
    export let onClick;
</script>

<style>
    button {
        display: flex;
        flex: content;
        align-items: center;
        justify-content: center;
        height: 48px;
        background-color: #212529;
        color: #dee2e6;
        border: none;
        padding: 16px;
        cursor: pointer;
        font-size: 1.5rem;
    }

    button:hover {
        background-color: #495057;
    }
</style>

<button on:click={onClick}>{buttonText}</button>