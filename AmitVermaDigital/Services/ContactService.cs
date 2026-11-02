using AmitVermaDigital.Data;
using AmitVermaDigital.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace AmitVermaDigital.Services;

public interface IContactService
{
    Task<ContactMessage> SaveMessageAsync(ContactMessage message);
    Task<List<ContactMessage>> GetMessagesAsync();
    Task<ContactMessage?> GetMessageByIdAsync(int id);
    Task MarkAsReadAsync(int id);
    Task DeleteMessageAsync(int id);
    Task<int> GetUnreadCountAsync();
}

public class ContactService : IContactService
{
    private readonly ApplicationDbContext _db;

    public ContactService(ApplicationDbContext db)
    {
        _db = db;
    }

    public async Task<ContactMessage> SaveMessageAsync(ContactMessage message)
    {
        message.CreatedAtUtc = DateTime.UtcNow;
        message.IsRead = false;
        _db.ContactMessages.Add(message);
        await _db.SaveChangesAsync();
        return message;
    }

    public async Task<List<ContactMessage>> GetMessagesAsync()
    {
        return await _db.ContactMessages
            .AsNoTracking()
            .OrderByDescending(m => m.CreatedAtUtc)
            .ToListAsync();
    }

    public async Task<ContactMessage?> GetMessageByIdAsync(int id)
    {
        return await _db.ContactMessages.FindAsync(id);
    }

    public async Task MarkAsReadAsync(int id)
    {
        var msg = await _db.ContactMessages.FindAsync(id);
        if (msg != null && !msg.IsRead)
        {
            msg.IsRead = true;
            await _db.SaveChangesAsync();
        }
    }

    public async Task DeleteMessageAsync(int id)
    {
        var msg = await _db.ContactMessages.FindAsync(id);
        if (msg != null)
        {
            _db.ContactMessages.Remove(msg);
            await _db.SaveChangesAsync();
        }
    }

    public async Task<int> GetUnreadCountAsync()
    {
        return await _db.ContactMessages.CountAsync(m => !m.IsRead);
    }
}
