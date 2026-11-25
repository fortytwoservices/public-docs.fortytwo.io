import { createMessage, encrypt, readKey } from 'openpgp';

// The key is read from the page's own code block, so the form and the published key cannot drift apart.
const KEY = /-----BEGIN PGP PUBLIC KEY BLOCK-----[\s\S]+?-----END PGP PUBLIC KEY BLOCK-----/;

const groups = (hex: string) => hex.toUpperCase().match(/.{4}/g)!.join(' ');

export async function mountPgpEncrypt(box: HTMLElement) {
  const armoredKey = [...document.querySelectorAll('pre')].map((p) => p.innerText.match(KEY)?.[0]).find(Boolean);
  if (!armoredKey) return;
  const key = await readKey({ armoredKey });
  const owner = key.getUserIDs()[0] ?? '';

  box.innerHTML = `
    <label class="pgp-label" for="pgp-input">Text to encrypt</label>
    <textarea id="pgp-input" class="pgp-input" rows="6" spellcheck="false" autocomplete="off" placeholder="Paste a token, password, key or message"></textarea>
    <div class="pgp-actions">
      <button type="button" class="btn pgp-encrypt-button">Encrypt</button>
      <span class="pgp-note">Encrypted in your browser. The text is never sent anywhere.</span>
    </div>
    <div class="code-block pgp-output" hidden>
      <div class="code-header"><span>Encrypted message</span></div>
      <pre><code></code></pre>
    </div>
    <p class="pgp-key">Recipient: ${owner.replace(/</g, '&lt;')}<br />Key fingerprint: <code>${groups(key.getFingerprint())}</code></p>`;

  const input = box.querySelector<HTMLTextAreaElement>('.pgp-input')!;
  const button = box.querySelector<HTMLButtonElement>('.pgp-encrypt-button')!;
  const output = box.querySelector<HTMLElement>('.pgp-output')!;
  const code = output.querySelector('code')!;

  button.addEventListener('click', async () => {
    if (!input.value.trim()) return input.focus();
    code.textContent = await encrypt({ message: await createMessage({ text: input.value }), encryptionKeys: key });
    output.hidden = false;
  });
  input.addEventListener('input', () => (output.hidden = true));
}
