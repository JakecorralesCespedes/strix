<script lang="ts">
  import {
    Alert,
    TableBodyRow,
    TableBodyCell,
    Button,
    Heading,
  } from "flowbite-svelte";
  import { PenOutline, PlusOutline } from "flowbite-svelte-icons";
  import { onMount } from "svelte";
  import DepartmentsForm from "../../components/DepartmentsForm.svelte";
  import type {
    Department,
    Role,
    Student,
    StudentOnDepartment,
    TableHeader,
    TablePagination,
    User,
  } from "../../types";
  import Table from "../../components/Table.svelte";
  import UserForm from "../../components/UserForm.svelte";
  import { getRoles } from "../../services/roles.service";
  import { getUsers } from "../../services/user.service";
  import { getStudentOnDepartment } from "../../services/request.service";
  import { getStudent } from "../../services/student.service";
  import { getDepartment } from "../../services/department.service";
  import RequestForm from "../../components/RequestForm.svelte";
  import type { RequestStatus } from "../../types";
  type RequestFormType = Partial<StudentOnDepartment>;
  let studentOnDepartment: StudentOnDepartment[] = [];
  let student: Student[] = [];
  let department: Department[] = [];
  let error: string | null = null;
  let success: string | null = null;
  let isLoading = false;
  let openModal = false;

  let modalMode: "create" | "update" = "create";

  const defaultRequest = {
    studentId: 0,
    departmentId: 0,
    status: undefined as RequestStatus | undefined,
  };

  let currentSelected: RequestFormType = defaultRequest;

  $: pagination = {
    page: 1,
  } as TablePagination;

  const tableHeaders: TableHeader[] = [
    { name: "Nombre", field: "" },
    { name: "Correo", field: "" },
    { name: "Telefono", field: "" },
    { name: "Role", field: "" },
    { name: "Departamento", field: "" },
    { name: "Accion", field: "" },
  ];

  function reloadData() {
    getStudentOnDepartment({ page: pagination.page }).then((res) => {
      studentOnDepartment = res?.data ?? [];
      pagination.page = res?.page ?? 1;
      pagination.next_page = res?.next_page;
      pagination.prev_page = res?.prev_page;
    });
  }

  onMount(() => {
    reloadData();
    getStudent({ size: 100 }).then((res) => {
      student = res?.data ?? [];
    });

    getDepartment({ size: 100 }).then((res) => {
      department = res?.data ?? [];
    });
  });

  function handleNext() {
    pagination.page = pagination.next_page ?? 1;
    reloadData();
  }

  function handlePrevious() {
    pagination.page = pagination.prev_page ?? 1;
    reloadData();
  }

  function handleFormModal() {
    openModal = true;
  }

  function handleUpdateModal(request: RequestFormType) {
    currentSelected = { ...request };
    modalMode = "update";
    openModal = true;
  }

  function handleCloseModal() {
    openModal = false;
    currentSelected = defaultRequest;
    modalMode = "create";
    reloadData();
  }
</script>

<RequestForm
  data={currentSelected}
  open={openModal}
  formMode={modalMode}
  on:close={handleCloseModal}
  {student}
  {department}
/>

<div class="w-full h-full px-4 grid gap-3">
  <div class="grid-flow-row">
    <Heading tag="h3" class="mb-4">Estudiantes</Heading>
  </div>
  <div class="grid-flow-row">
    {#if error}
      <Alert type="error" dismissable>{error}</Alert>
    {/if}
    {#if success}
      <Alert type="success" dismissable>{success}</Alert>
    {/if}
    <div class="mt-3 mb-3">
      <Button size="xs" color="primary" on:click={handleFormModal}>
        <PlusOutline /> Agregar
      </Button>
    </div>
    <Table
      data={studentOnDepartment}
      headers={tableHeaders}
      {pagination}
      on:next={handleNext}
      on:previous={handlePrevious}
    >
      <TableBodyRow slot="row" let:row as User>
        <TableBodyCell>{row.studentId}</TableBodyCell>
        <TableBodyCell>{row.departmentId}</TableBodyCell>
        <TableBodyCell>{row.status}</TableBodyCell>
        <TableBodyCell>
          <Button
            size="xs"
            color="primary"
            on:click={() => handleUpdateModal(row)}
          >
            <PenOutline />
            Editar
          </Button>
          <!-- <Button size="xs" color="red">Eliminar</Button> -->
        </TableBodyCell>
      </TableBodyRow>
    </Table>
  </div>
</div>
