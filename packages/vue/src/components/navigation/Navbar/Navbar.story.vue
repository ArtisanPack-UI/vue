<script setup lang="ts">
import Button from '../../form/Button/Button.vue';
import Navbar from './Navbar.vue';
import NavbarItem from './NavbarItem.vue';
</script>

<template>
  <Story title="Navigation/Navbar" group="navigation">
    <Variant title="Bar">
      <Navbar :sticky="false">
        <template #brand><a href="#">Horizon</a></template>
        <NavbarItem href="#properties" current>Properties</NavbarItem>
        <NavbarItem href="#analytics">Analytics</NavbarItem>
        <NavbarItem href="#tools">Tools &amp; calculators</NavbarItem>
        <template #actions>
          <Button variant="ghost" color="neutral" size="sm">Sign in</Button>
          <Button size="sm">Get started</Button>
        </template>
      </Navbar>
    </Variant>
    <Variant title="Island on glass">
      <div style="padding: 16px; background: linear-gradient(135deg, #5b7fa3, #e8b34a)">
        <Navbar
          layout="island"
          surface="glass"
          :sticky="false"
          brand="Socials"
          :links="[
            { label: 'Feed', href: '#feed', current: true },
            { label: 'Pages', href: '#pages' },
          ]"
        >
          <template #actions><Button size="sm" leading-icon="plus">New page</Button></template>
        </Navbar>
      </div>
    </Variant>
  </Story>
</template>
