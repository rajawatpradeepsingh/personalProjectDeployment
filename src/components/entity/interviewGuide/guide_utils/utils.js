export const mapGuides = (data) => {
  return data.map((r) => ({
    ...r,
    createdAt: new Date(r.createdAt).toLocaleDateString(),
    updatedAt: r.updatedAt ? new Date(r.updatedAt).toLocaleDateString() : null,
    disableSelection: true, // disable rowSelection: all selections will be made from expandable detail rows
  }));
};
