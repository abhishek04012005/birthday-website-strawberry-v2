'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getGuests, saveGuest, updateGuest, deleteGuest, bulkSaveGuests, GuestData } from '@/lib/supabase';
import * as XLSX from 'xlsx';
import config from '@/data/config.json';
import styles from '@/styles/GuestManagement.module.css';
import EditIcon from '@mui/icons-material/Edit';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import DeleteIcon from '@mui/icons-material/Delete';

interface Guest {
  id: number;
  title: string;
  name: string;
  phone: string | null;
  child_name: string;
  created_at: string;
  updated_at: string;
}

export default function GuestManagementClient() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'list' | 'add' | 'upload'>('list');
  const [modalMessage, setModalMessage] = useState<{text: string, type: 'success' | 'error'} | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    name: '',
    phone: '',
  });

  // Edit state
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);

  // WhatsApp message state
  const [customMessage, setCustomMessage] = useState(`Hi {title} {name}, you're invited to ${config.child.name}'s birthday party! 🎉`);

  useEffect(() => {
    const checkAuth = async () => {
      const sessionStr = localStorage.getItem('adminSession');
      if (!sessionStr) {
        router.push('/auth');
        return;
      }

      try {
        const session = JSON.parse(sessionStr);
        if (session.expiresAt < Date.now()) {
          localStorage.removeItem('adminSession');
          router.push('/auth');
          return;
        }
        setUser(session.user);
      } catch (error) {
        localStorage.removeItem('adminSession');
        router.push('/auth');
        return;
      }

      try {
        const guestResult = await getGuests(config.child.name);
        setGuests(guestResult?.data || []);
      } catch (error) {
        console.error('Error fetching guests:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleTabChange = (tab: 'list' | 'add' | 'upload') => {
    setActiveTab(tab);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setModalMessage({ text: 'Name is required', type: 'error' });
      return;
    }

    try {
      if (editingGuest) {
        await updateGuest(editingGuest.id, {
          title: formData.title,
          name: formData.name,
          phone: formData.phone || null,
        });
        setModalMessage({ text: 'Guest updated successfully!', type: 'success' });
      } else {
        await saveGuest({
          title: formData.title,
          name: formData.name,
          phone: formData.phone || null,
          childName: config.child.name,
        });
        setModalMessage({ text: 'Guest added successfully!', type: 'success' });
      }

      // Reset form
      setFormData({ title: '', name: '', phone: '' });
      setEditingGuest(null);

      // Refresh guests list
      const guestResult = await getGuests(config.child.name);
      setGuests(guestResult?.data || []);

    } catch (error) {
      console.error('Error saving guest:', error);
      setModalMessage({ text: 'Failed to save guest', type: 'error' });
    }
  };

  const handleEdit = (guest: Guest) => {
    setFormData({
      title: guest.title,
      name: guest.name,
      phone: guest.phone || '',
    });
    setEditingGuest(guest);
    setActiveTab('add');
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this guest?')) return;

    try {
      await deleteGuest(id);
      setModalMessage({ text: 'Guest deleted successfully!', type: 'success' });

      // Refresh guests list
      const guestResult = await getGuests(config.child.name);
      setGuests(guestResult?.data || []);

    } catch (error) {
      console.error('Error deleting guest:', error);
      setModalMessage({ text: 'Failed to delete guest', type: 'error' });
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      const guestsToSave: GuestData[] = jsonData.map((row: any) => ({
        title: row.title || row.Title || '',
        name: row.name || row.Name || '',
        phone: row.phone || row.Phone || null,
        childName: config.child.name,
      }));

      await bulkSaveGuests(guestsToSave);
      setModalMessage({ text: `${guestsToSave.length} guests imported successfully!`, type: 'success' });

      // Refresh guests list
      const guestResult = await getGuests(config.child.name);
      setGuests(guestResult?.data || []);

    } catch (error) {
      console.error('Error importing guests:', error);
      setModalMessage({ text: 'Failed to import guests', type: 'error' });
    }
  };

  const generateWhatsAppMessage = (guest: Guest, includeRsvp = true) => {
    if (!guest.name) return '';

    const rsvpName = `${guest.title ? guest.title + ' ' : ''}${guest.name}`.trim();
    const rsvpUrl = new URL(`${window.location.origin}/`);
    rsvpUrl.searchParams.set('name', rsvpName);
    if (guest.phone) {
      const sanitizedPhone = guest.phone.replace(/\D/g, '');
      rsvpUrl.searchParams.set('phone', sanitizedPhone);
    }
    rsvpUrl.hash = 'rsvp';

    let message = customMessage
      .replace('{title}', guest.title || '')
      .replace('{name}', guest.name)
      .replace('{rsvpUrl}', rsvpUrl.toString());

    if (includeRsvp) {
      message += `\n\nPlease RSVP here: ${rsvpUrl.toString()}`;
    }

    return message;
  };

  const sendWhatsAppMessage = (guest: Guest) => {
    if (!guest.phone) {
      alert('No phone number available for this guest');
      return;
    }

    const message = generateWhatsAppMessage(guest);
    const whatsappUrl = `https://wa.me/${guest.phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const exportToExcel = () => {
    const dataToExport = guests.map(guest => ({
      Title: guest.title,
      Name: guest.name,
      Phone: guest.phone,
      'Created At': new Date(guest.created_at).toLocaleDateString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Guests');
    XLSX.writeFile(workbook, 'guests.xlsx');
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading guest management...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Guest Management</h1>
        <button
          onClick={() => {
            localStorage.removeItem('adminSession');
            router.push('/auth');
          }}
          className={styles.logoutBtn}
        >
          Logout
        </button>
      </div>

      <div className={styles.tabs}>
        <button
          type="button"
          className={`${styles.tab} ${activeTab === 'list' ? styles.active : ''}`}
          onClick={() => handleTabChange('list')}
        >
          Guest List ({guests.length})
        </button>
        <button
          type="button"
          className={`${styles.tab} ${activeTab === 'add' ? styles.active : ''}`}
          onClick={() => handleTabChange('add')}
        >
          {editingGuest ? 'Edit Guest' : 'Add Guest'}
        </button>
        <button
          type="button"
          className={`${styles.tab} ${activeTab === 'upload' ? styles.active : ''}`}
          onClick={() => handleTabChange('upload')}
        >
          Bulk Import
        </button>
      </div>

      <div className={styles.content}>
        {activeTab === 'list' && (
          <div className={styles.guestList}>
            <div className={styles.listHeader}>
              <h2>Guest List</h2>
              <button onClick={exportToExcel} className={styles.exportBtn}>
                Export to Excel
              </button>
            </div>

            {guests.length === 0 ? (
              <div className={styles.emptyState}>
                <p>No guests found. Add your first guest!</p>
              </div>
            ) : (
              <div className={styles.tableContainer}>
                <table className={styles.guestTable}>
                  <thead>
                    <tr>
                      <th>S.No</th>
                      <th>Title</th>
                      <th>Name</th>
                      <th>Phone</th>
                      <th>Created</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {guests.map((guest, index) => (
                      <tr key={guest.id}>
                        <td>{index + 1}</td>
                        <td>{guest.title}</td>
                        <td>{guest.name}</td>
                        <td>{guest.phone || '-'}</td>
                        <td>{new Date(guest.created_at).toLocaleDateString()}</td>
                        <td>
                          <div className={styles.actions}>
                            <button
                              onClick={() => handleEdit(guest)}
                              className={styles.editBtn}
                              title="Edit"
                            >
                              <EditIcon />
                            </button>
                            <button
                              onClick={() => sendWhatsAppMessage(guest)}
                              className={styles.whatsappBtn}
                              disabled={!guest.phone}
                              title="Send WhatsApp"
                            >
                              <WhatsAppIcon />
                            </button>
                            <button
                              onClick={() => handleDelete(guest.id)}
                              className={styles.deleteBtn}
                              title="Delete"
                            >
                              <DeleteIcon />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'add' && (
          <div className={styles.addGuest}>
            <h2>{editingGuest ? 'Edit Guest' : 'Add New Guest'}</h2>
            <form onSubmit={handleSubmit} className={styles.guestForm}>
              <div className={styles.formGroup}>
                <label htmlFor="title">Title (Optional)</label>
                <select
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className={styles.select}
                >
                  <option value="">Select Title</option>
                  <option value="Mr.">Mr.</option>
                  <option value="Mrs.">Mrs.</option>
                  <option value="Ms.">Ms.</option>
                  <option value="Dr.">Dr.</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="name">Name *</label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="phone">Phone (Optional)</label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={styles.input}
                />
              </div>

              <div className={styles.formActions}>
                <button type="submit" className={styles.submitBtn}>
                  {editingGuest ? 'Update Guest' : 'Add Guest'}
                </button>
                {editingGuest && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingGuest(null);
                      setFormData({ title: '', name: '', phone: '' });
                    }}
                    className={styles.cancelBtn}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        {activeTab === 'upload' && (
          <div className={styles.bulkImport}>
            <h2>Bulk Import Guests</h2>
            <div className={styles.uploadSection}>
              <div className={styles.uploadArea}>
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileUpload}
                  className={styles.fileInput}
                  id="file-upload"
                />
                <label htmlFor="file-upload" className={styles.uploadLabel}>
                  <div className={styles.uploadIcon}>📄</div>
                  <div className={styles.uploadText}>
                    <strong>Click to upload</strong> or drag and drop
                  </div>
                  <div className={styles.uploadHint}>
                    Excel file (.xlsx, .xls) with columns: title, name, phone
                  </div>
                </label>
              </div>

              <div className={styles.templateSection}>
                <h3>Excel Template</h3>
                <p>Your Excel file should have these columns:</p>
                <ul>
                  <li><strong>title</strong> (optional): Mr., Mrs., Ms., Dr.</li>
                  <li><strong>name</strong> (required): Guest's full name</li>
                  <li><strong>phone</strong> (optional): Phone number for WhatsApp</li>
                </ul>
                <button
                  onClick={() => {
                    const template = [
                      { title: 'Mr.', name: 'John Doe', phone: '+1234567890' },
                      { title: 'Mrs.', name: 'Jane Smith', phone: '+1234567891' },
                    ];
                    const worksheet = XLSX.utils.json_to_sheet(template);
                    const workbook = XLSX.utils.book_new();
                    XLSX.utils.book_append_sheet(workbook, worksheet, 'Guests');
                    XLSX.writeFile(workbook, 'guest_template.xlsx');
                  }}
                  className={styles.templateBtn}
                >
                  Download Template
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {modalMessage && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <p className={modalMessage.type === 'success' ? styles.success : styles.error}>
              {modalMessage.text}
            </p>
            <button
              onClick={() => setModalMessage(null)}
              className={styles.modalClose}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}