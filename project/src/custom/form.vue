<template>
  <div style="padding:12px;border:1px solid #ccc;margin-top:8px;">
    <strong>Product Form</strong>

    <div
      v-for="(item, i) in products"
      :key="i"
      style="border:1px solid #ddd;padding:8px;margin-top:8px;"
    >
      <div style="margin-bottom:4px;">
        <label>Product Name</label><br />
        <input
          :value="item.title"
          @input="update(i, 'title', ($event.target as HTMLInputElement).value)"
          style="width:100%;box-sizing:border-box;"
        />
      </div>
      <div style="margin-bottom:4px;">
        <label>Price</label><br />
        <input
          :value="item.price"
          @input="update(i, 'price', ($event.target as HTMLInputElement).value)"
          style="width:100%;box-sizing:border-box;"
        />
      </div>
      <div style="margin-bottom:4px;">
        <label>Image URL</label><br />
        <input
          :value="item.image"
          @input="update(i, 'image', ($event.target as HTMLInputElement).value)"
          style="width:100%;box-sizing:border-box;"
        />
      </div>
      <button @click="deleteProduct(i)" style="margin-top:4px;">Delete Product</button>
    </div>

    <button @click="addProduct" style="margin-top:10px;">Add Product</button>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import type { _p_TYP, _$p_TYP } from "../shared/types";

console.log("Product Form Loaded");

const { _p, _$p } = defineProps<{ _p: _p_TYP; _$p: _$p_TYP }>();

const raw: any[] = _$p?.data?.curr?.data?.value?.l ?? [];
const products = ref<{ title: string; price: string; image: string }[]>(
  raw.map((x: any) => ({ title: x.title ?? "", price: x.price ?? "", image: x.image ?? "" }))
);

function emit_update() {
  const updatedData = { value: { l: products.value.map((p) => ({ ...p })) } };
  console.log("Product Updated", updatedData);
  _p.f.call("msg", {
    type: "product:form:change",
    _p,
    _$p,
    custom: { data: updatedData },
  });
}

function addProduct() {
  console.log("Product Added");
  products.value.push({ title: "", price: "", image: "" });
  emit_update();
}

function deleteProduct(i: number) {
  console.log("Product Deleted");
  products.value.splice(i, 1);
  emit_update();
}

function update(i: number, field: "title" | "price" | "image", val: string) {
  products.value[i][field] = val;
  emit_update();
}
</script>
