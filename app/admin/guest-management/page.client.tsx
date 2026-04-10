'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getGuests, saveGuest, updateGuest, deleteGuest, bulkSaveGuests, GuestData } from '@/lib/supabase';
import * as XLSX from 'xlsx';
import config from '@/data/config.json';
import styles from '@/styles/GuestManagement.module.css';
import EditIcon from '@mui/icons-material/Edit';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import html2canvas from 'html2canvas';

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

  // E-card dropdown state
  const [showECardDropdown, setShowECardDropdown] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Bulk generation state
  const [bulkGenerating, setBulkGenerating] = useState(false);
  const [bulkProgress, setBulkProgress] = useState({ current: 0, total: 0 });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showECardDropdown && !(event.target as Element).closest('.dropdownContainer')) {
        setShowECardDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showECardDropdown]);

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

  const downloadECard = async (guest: Guest, includeName: boolean = true) => {
    console.log('Starting e-card download for guest:', guest.name);

    // Validate required data
    if (!guest || !config || !config.child || !config.party) {
      console.error('Missing required data for e-card generation');
      setModalMessage({ text: 'Missing required data for e-card generation', type: 'error' });
      return;
    }

    let overlay: HTMLElement | null = null;
    let statusDiv: HTMLElement | null = null;

    try {
      // Show loading status
      setModalMessage({ text: 'Preparing e-card...', type: 'success' });

      // Create a background overlay
      overlay = document.createElement('div');
      overlay.style.position = 'fixed';
      overlay.style.top = '0';
      overlay.style.left = '0';
      overlay.style.width = '100vw';
      overlay.style.height = '100vh';
      overlay.style.background = 'rgba(0, 0, 0, 0.5)';
      overlay.style.zIndex = '99999';
      overlay.style.display = 'flex';
      overlay.style.flexDirection = 'column';
      overlay.style.alignItems = 'center';
      overlay.style.justifyContent = 'center';
      overlay.style.gap = '20px';
      document.body.appendChild(overlay);

      // Create status message
      statusDiv = document.createElement('div');
      statusDiv.style.background = 'white';
      statusDiv.style.padding = '20px';
      statusDiv.style.borderRadius = '10px';
      statusDiv.style.textAlign = 'center';
      statusDiv.style.color = '#333';
      statusDiv.style.fontSize = '16px';
      statusDiv.style.fontWeight = 'bold';
      statusDiv.style.zIndex = '100000';
      statusDiv.innerHTML = 'Processing e-card...';
      overlay.appendChild(statusDiv);

      // Create the e-card element
      const eCardElement = document.createElement('div');
      eCardElement.id = 'ecard-capture';
      eCardElement.style.width = '600px';
      eCardElement.style.height = '800px';
      eCardElement.style.background = 'linear-gradient(135deg, #ff6b9d 0%, #c44569 50%, #f093fb 100%)';
      eCardElement.style.borderRadius = '20px';
      eCardElement.style.padding = '40px';
      eCardElement.style.display = 'flex';
      eCardElement.style.flexDirection = 'column';
      eCardElement.style.alignItems = 'center';
      eCardElement.style.justifyContent = 'center';
      eCardElement.style.textAlign = 'center';
      eCardElement.style.fontFamily = '"Nunito", sans-serif';
      eCardElement.style.color = 'white';
      eCardElement.style.position = 'relative';
      eCardElement.style.boxShadow = '0 20px 40px rgba(0,0,0,0.5)';
      eCardElement.style.margin = '0';
      eCardElement.style.visibility = 'visible';
      eCardElement.style.opacity = '1';
      eCardElement.style.overflow = 'visible';
      eCardElement.style.boxSizing = 'border-box';
      eCardElement.style.zIndex = '100001';

      const guestName = includeName ? `${guest.title} ${guest.name}` : 'Dear Friend';

      eCardElement.innerHTML = `
        <div style="font-size: 3.5rem; margin-bottom: 20px;">
          🎉🎂🎈
        </div>

        <h1 style="font-family: 'Pacifico', cursive; font-size: 2.8rem; margin: 0 0 15px 0; text-shadow: 2px 2px 4px rgba(0,0,0,0.3); color: #fff;">
          You're Invited!
        </h1>

        <div style="font-size: 1.6rem; margin-bottom: 25px; font-weight: 300;">
          ${guestName}
        </div>

        <div style="background: rgba(255,255,255,0.15); border-radius: 18px; padding: 25px; margin-bottom: 25px; border: 2px solid rgba(255,255,255,0.25);">
          <h2 style="font-family: 'Pacifico', cursive; font-size: 2rem; margin: 0 0 12px 0; color: #fff;">
            ${config.child.name}'s Birthday
          </h2>

          <div style="font-size: 1.2rem; line-height: 1.5;">
            <div style="margin-bottom: 8px;">📅 ${config.party.date}</div>
            <div style="margin-bottom: 8px;">🕐 ${config.party.time}</div>
            <div style="margin-bottom: 8px;">📍 ${config.party.venue}</div>
            <div>🏠 ${config.party.address}</div>
          </div>
        </div>

        <div style="font-size: 1.2rem; margin-bottom: 15px; font-weight: 300;">
          Join us for cake, games & fun! 🎈
        </div>

        <div style="font-size: 2.5rem;">
          🧁🎁🎪✨
        </div>
      `;

      overlay.appendChild(eCardElement);

      // Wait for rendering
      await new Promise(resolve => setTimeout(resolve, 1500));

      console.log('Starting html2canvas capture...');
      statusDiv.innerHTML = 'Capturing image...';

      const canvas = await html2canvas(eCardElement, {
        scale: 2.5,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: 600,
        height: 800,
        scrollX: 0,
        scrollY: 0,
        logging: false,
        imageTimeout: 0,
        removeContainer: false,
      });

      console.log('html2canvas capture completed, canvas dimensions:', canvas.width, 'x', canvas.height);

      // Convert canvas to blob for more reliable download
      statusDiv.innerHTML = 'Preparing download...';

      canvas.toBlob((blob) => {
        if (!blob) {
          throw new Error('Failed to create blob from canvas');
        }

        console.log('Blob created, size:', blob.size);

        // Create download link
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        const fileName = includeName
          ? `Birthday_Invitation_${guest.name.replace(/\s+/g, '_')}.png`
          : `Birthday_Invitation_Generic.png`;
        
        link.href = url;
        link.download = fileName;
        link.style.display = 'none';
        document.body.appendChild(link);

        console.log('Triggering download for file:', fileName);
        link.click();

        // Cleanup
        setTimeout(() => {
          document.body.removeChild(link);
          URL.revokeObjectURL(url);

          // Remove overlay
          if (overlay && overlay.parentNode) {
            overlay.parentNode.removeChild(overlay);
          }

          console.log('Download completed successfully for file:', fileName);
          setModalMessage({
            text: `✅ E-card ${includeName ? 'with name' : 'without name'} downloaded!`,
            type: 'success'
          });
        }, 500);
      }, 'image/png', 0.95);

    } catch (error) {
      console.error('Error downloading e-card:', error);

      // Cleanup on error
      if (overlay && overlay.parentNode) {
        overlay.parentNode.removeChild(overlay);
      }

      const errorMsg = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('Detailed error:', errorMsg);
      setModalMessage({ text: `Failed: ${errorMsg}`, type: 'error' });
    }
  };

  const generateAllECards = async () => {
    if (guests.length === 0) {
      setModalMessage({ text: 'No guests to generate e-cards for', type: 'error' });
      return;
    }

    setBulkGenerating(true);
    setBulkProgress({ current: 0, total: guests.length * 2 }); // 2 versions per guest
    let successCount = 0;
    let errorCount = 0;

    try {
      for (let i = 0; i < guests.length; i++) {
        const guest = guests[i];

        // Generate with name
        try {
          await generateAndDownloadECard(guest, true);
          setBulkProgress({ current: i * 2 + 1, total: guests.length * 2 });
          successCount++;
        } catch (error) {
          console.error(`Failed to generate e-card with name for ${guest.name}:`, error);
          errorCount++;
          setBulkProgress({ current: i * 2 + 1, total: guests.length * 2 });
        }

        // Add delay between downloads to prevent browser blocking
        await new Promise(resolve => setTimeout(resolve, 500));

        // Generate without name
        try {
          await generateAndDownloadECard(guest, false);
          setBulkProgress({ current: i * 2 + 2, total: guests.length * 2 });
          successCount++;
        } catch (error) {
          console.error(`Failed to generate e-card without name for ${guest.name}:`, error);
          errorCount++;
          setBulkProgress({ current: i * 2 + 2, total: guests.length * 2 });
        }

        // Add delay between downloads
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      setBulkGenerating(false);
      const message = `✅ Generated ${successCount} e-cards${errorCount > 0 ? ` (${errorCount} failed)` : ''}`;
      setModalMessage({ text: message, type: 'success' });
    } catch (error) {
      console.error('Bulk generation error:', error);
      setBulkGenerating(false);
      setModalMessage({ text: 'Error during bulk generation', type: 'error' });
    }
  };

  const generateAndDownloadECard = (guest: Guest, includeName: boolean): Promise<void> => {
    return new Promise((resolve, reject) => {
      let overlay: HTMLElement | null = null;

      try {
        // Create overlay
        overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100vw';
        overlay.style.height = '100vh';
        overlay.style.background = 'rgba(0, 0, 0, 0.5)';
        overlay.style.zIndex = '99999';
        overlay.style.display = 'flex';
        overlay.style.flexDirection = 'column';
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';
        document.body.appendChild(overlay);

        // Create e-card
        const eCardElement = document.createElement('div');
        eCardElement.style.width = '600px';
        eCardElement.style.height = '800px';
        eCardElement.style.background = 'linear-gradient(135deg, #ff6b9d 0%, #c44569 50%, #f093fb 100%)';
        eCardElement.style.borderRadius = '20px';
        eCardElement.style.padding = '40px';
        eCardElement.style.display = 'flex';
        eCardElement.style.flexDirection = 'column';
        eCardElement.style.alignItems = 'center';
        eCardElement.style.justifyContent = 'center';
        eCardElement.style.textAlign = 'center';
        eCardElement.style.fontFamily = '"Nunito", sans-serif';
        eCardElement.style.color = 'white';
        eCardElement.style.position = 'relative';
        eCardElement.style.boxShadow = '0 20px 40px rgba(0,0,0,0.5)';
        eCardElement.style.margin = '0';
        eCardElement.style.visibility = 'visible';
        eCardElement.style.opacity = '1';
        eCardElement.style.overflow = 'visible';
        eCardElement.style.boxSizing = 'border-box';

        const guestName = includeName ? `${guest.title} ${guest.name}` : 'Dear Friend';

        eCardElement.innerHTML = `
          <div style="font-size: 3.5rem; margin-bottom: 20px;">
            🎉🎂🎈
          </div>

          <h1 style="font-family: 'Pacifico', cursive; font-size: 2.8rem; margin: 0 0 15px 0; text-shadow: 2px 2px 4px rgba(0,0,0,0.3); color: #fff;">
            You're Invited!
          </h1>

          <div style="font-size: 1.6rem; margin-bottom: 25px; font-weight: 300;">
            ${guestName}
          </div>

          <div style="background: rgba(255,255,255,0.15); border-radius: 18px; padding: 25px; margin-bottom: 25px; border: 2px solid rgba(255,255,255,0.25);">
            <h2 style="font-family: 'Pacifico', cursive; font-size: 2rem; margin: 0 0 12px 0; color: #fff;">
              ${config.child.name}'s Birthday
            </h2>

            <div style="font-size: 1.2rem; line-height: 1.5;">
              <div style="margin-bottom: 8px;">📅 ${config.party.date}</div>
              <div style="margin-bottom: 8px;">🕐 ${config.party.time}</div>
              <div style="margin-bottom: 8px;">📍 ${config.party.venue}</div>
              <div>🏠 ${config.party.address}</div>
            </div>
          </div>

          <div style="font-size: 1.2rem; margin-bottom: 15px; font-weight: 300;">
            Join us for cake, games & fun! 🎈
          </div>

          <div style="font-size: 2.5rem;">
            🧁🎁🎪✨
          </div>
        `;

        overlay.appendChild(eCardElement);

        // Wait for rendering
        setTimeout(async () => {
          try {
            const canvas = await html2canvas(eCardElement, {
              scale: 2.5,
              useCORS: true,
              allowTaint: true,
              backgroundColor: '#ffffff',
              width: 600,
              height: 800,
              scrollX: 0,
              scrollY: 0,
              logging: false,
              imageTimeout: 0,
              removeContainer: false,
            });

            // Convert to blob and download
            canvas.toBlob((blob) => {
              if (!blob) {
                throw new Error('Failed to create blob');
              }

              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              const fileName = includeName
                ? `Birthday_Invitation_${guest.name.replace(/\s+/g, '_')}.png`
                : `Birthday_Invitation_${guest.name.replace(/\s+/g, '_')}_Generic.png`;

              link.href = url;
              link.download = fileName;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(url);

              // Remove overlay
              if (overlay && overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
              }

              resolve();
            }, 'image/png', 0.95);
          } catch (error) {
            // Remove overlay on error
            if (overlay && overlay.parentNode) {
              overlay.parentNode.removeChild(overlay);
            }
            reject(error);
          }
        }, 800);
      } catch (error) {
        // Remove overlay on error
        if (overlay && overlay.parentNode) {
          overlay.parentNode.removeChild(overlay);
        }
        reject(error);
      }
    });
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
              <div className={styles.headerActions}>
                <button 
                  onClick={exportToExcel} 
                  className={styles.exportBtn}
                  disabled={bulkGenerating}
                >
                  Export to Excel
                </button>
                <button 
                  onClick={generateAllECards} 
                  className={styles.generateAllBtn}
                  disabled={bulkGenerating || guests.length === 0}
                  title={guests.length === 0 ? 'No guests available' : 'Generate e-cards for all guests'}
                >
                  {bulkGenerating ? `Generating... (${bulkProgress.current}/${bulkProgress.total})` : '📥 Generate All E-Cards'}
                </button>
              </div>
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
                            <div className={styles.dropdownContainer}>
                              <button
                                onClick={() => downloadECard(guest, true)}
                                className={styles.downloadBtn}
                                title="Download E-card (with name)"
                              >
                                <DownloadIcon />
                              </button>
                           
                              
                            </div>
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

      {bulkGenerating && (
        <div className={styles.progressOverlay}>
          <div className={styles.progressCard}>
            <h3>Generating E-Cards</h3>
            <p className={styles.progressText}>
              {bulkProgress.current} / {bulkProgress.total} e-cards generated
            </p>
            <div className={styles.progressBar}>
              <div 
                className={styles.progressBarFill}
                style={{ width: `${(bulkProgress.current / bulkProgress.total) * 100}%` }}
              ></div>
            </div>
            <p className={styles.progressPercentage}>
              {Math.round((bulkProgress.current / bulkProgress.total) * 100)}%
            </p>
          </div>
        </div>
      )}
    </div>
  );
}