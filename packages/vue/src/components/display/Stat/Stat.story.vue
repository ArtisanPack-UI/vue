<script setup lang="ts">
import Stat from './Stat.vue';
</script>

<template>
  <Story title="Display/Stat" group="display">
    <Variant title="Default">
      <Stat
        label="Total revenue"
        value="7,415,644"
        icon="wallet"
        color="info"
        :change="-5.4"
        description="vs last month"
      />
    </Variant>

    <Variant title="Row, one emphasized">
      <div style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px">
        <Stat
          label="Total income"
          value="$348,261"
          icon="wallet"
          color="primary"
          :change="10.9"
          description="vs last month"
          emphasis
        />
        <Stat
          label="Profit"
          value="$15,708.98"
          icon="trending-up"
          color="success"
          :change="8.1"
          description="vs last month"
        />
        <Stat label="Conversion" value="10.87" unit="%" :change="2.5" description="vs last month" />
      </div>
    </Variant>

    <Variant title="Sizes and bare">
      <div style="display: flex; gap: 16px; align-items: start">
        <Stat size="sm" label="Properties visits" value="721K" :change="11" />
        <Stat label="Deals completed" value="1,156" :change="11" />
        <Stat size="lg" label="Amount invested" value="367K" :change="11" />
        <Stat
          size="sm"
          bare
          label="Hours listened"
          value="34.6"
          delta="6.2 hrs"
          trend="up"
          description="this week"
        />
      </div>
    </Variant>
  </Story>
</template>
