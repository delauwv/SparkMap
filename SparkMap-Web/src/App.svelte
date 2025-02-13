<script>
    import Header from './components/header/Header.svelte';
    import SideBar from './components/sidebar/Sidebar.svelte';
    import Map from './components/map/Map.svelte';

    let map;
</script>
  
<main>
    <Header />
    <section>
        <SideBar {map} />
        <Map bind:this={map} />
    </section>
</main>