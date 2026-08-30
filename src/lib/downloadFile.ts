export const saveBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.rel = 'noopener';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
};

export const safeName = (s: string) =>
  s
    .replace(/[\\/:*?"<>|]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 120);

export const downloadRemote = async (url: string, filename: string) => {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(String(res.status));
    saveBlob(await res.blob(), filename);
    return true;
  } catch {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    a.remove();
    return false;
  }
};

export default downloadRemote;
