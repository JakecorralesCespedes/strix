<script lang="ts">
  import {
    Button,
    Input,
    Label,
    Modal,
    MultiSelect,
    Select,
    Spinner,
  } from "flowbite-svelte";
  import {
    RequestStatus,
    type Department,
    type Role,
    type Student,
    type StudentOnDepartment,
    type User,
  } from "../types";

  import { createEventDispatcher, onMount } from "svelte";

  import { createRole, updateRole } from "../services/roles.service";
  import { getPermissions } from "../services/permissions.service";
  import { getAvailablePersmissions } from "../utils/permission-parser";
  import { CloseCircleOutline } from "flowbite-svelte-icons";
  import { getAvailableRequestStatus } from "../utils/requestStatus-parser";
  import {
    createStudentOnDepartment,
    updateStudentOnDepartment,
  } from "../services/request.service";
  import Request from "../pages/application/Request.svelte";

  const dispatch = createEventDispatcher();
  export let open: boolean = false;
  export let formMode: "create" | "update" = "create";

  export let data: Partial<StudentOnDepartment> = {};

  export const student: Student[] = [];

  export const department: Department[] = [];

  let isLoading = false;
  const formattedRequestStatus = getAvailableRequestStatus();

  function close() {
    dispatch("close");
    isLoading = false;
    open = false;
  }
  async function handleSubmit() {
    isLoading = true;
    try {
      if (formMode === "create") {
        // create
        await createStudentOnDepartment({
          id: data.id ?? 0,
          studentId: data.studentId ?? 0,
          departmentId: data.departmentId ?? 0,
          status: data.status ?? RequestStatus.PENDING,
        } as StudentOnDepartment);
      } else {
        // update
        await updateStudentOnDepartment(
          data.id as number,
          {
            id: data.id ?? 0,
            studentId: data.studentId ?? 0,
            departmentId: data.departmentId ?? 0,
            status: data.status ?? RequestStatus.PENDING,
          } as StudentOnDepartment,
        );
      }
    } catch (error) {}
    close();
    isLoading = false;
  }
</script>

<div class="container">
  <form class="flex flex-col space-y-3 mb-4">
    <Label>Estudiante</Label>
    <Input bind:value={data.studentId} placeholder="Nombre" />
    <Label>Departamento</Label>
    <Input bind:value={data.departmentId} placeholder="Nombre" />
    <Label>Estado</Label>
    <Select
      size="sm"
      bind:value={data.status}
      items={formattedRequestStatus}
      placeholder="Selecciona el estado"
    />
  </form>
  <div class="flex flex-row justify-end space-x-2">
    <Button size="sm" color="primary" on:click={handleSubmit}>
      {formMode === "create" ? "Crear" : "Actualizar"}
      {#if isLoading}
        <Spinner color="white" size="sm" />
      {/if}
    </Button>
    <Button size="sm" color="red" on:click={close}>
      <CloseCircleOutline /> Cerrar
    </Button>
  </div>
</div>
