<template>
  <div class="">
    <div
      v-if="!loaded"
      class="absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center"
    >
      <UtilDropZone v-if="!loaded && !loading" @files-dropped="onFileDropped" />
      <LoadingOverlay v-if="loading" />
    </div>
    <div v-if="loaded" class="w-full flex flex-row flex-wrap">
      <aside class="w-1/5 border-r bg-gray-100 border-gray-400/50 h-screen">
        <div class="sticky top-0 w-full">
          <SidebarUserProfile />
          <SidebarSectionDivider />
          <SidebarRecordingDevices />
        </div>
      </aside>

      <main class="w-4/5">
        <div class="flex flex-col">
          <SectionHeader>Ride Profile</SectionHeader>
          <ProfileChart class="h-[125px]" />
        </div>
        <div class="flex flex-col">
          <SectionHeader>Power</SectionHeader>
          <ActivityGraph class="h-[300px]" />
        </div>
        <div class="flex flex-col">
          <SectionHeader>Critical Power</SectionHeader>
          <div class="flex flex-row">
            <CriticalPowerGraph class="h-[300px] w-3/5" />
            <CriticalPowerTable class="flex-none w-2/5" />
          </div>
        </div>
      </main>
    </div>
  </div>
</template>
<script setup lang="ts">
const store = useWorkoutFileStore();
const { loaded, loading } = workoutFileStoreToRefs();

async function onFileDropped(files: File[]) {
  (await store).loadFile(files[0]);
}
</script>
