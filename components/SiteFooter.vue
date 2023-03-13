<template>
  <footer
    class="fixed bottom-0 flex flex-row w-full bg-gray-100 border-t border-gray-400/50 p-1 text-sm font-extralight"
  >
    <div class="grow">
      dualrecording.com
      <Icon class="pb-0.5" name="ant-design:copyright-outlined" />
      {{ new Date().getFullYear() }}
    </div>
    <div class="self-end">
      <a href="https://github.com/mikeswart/indie-velo-duals">
        <Icon name="logos:github-icon" class="text-lg" />
      </a>
    </div>
  </footer>
</template>
