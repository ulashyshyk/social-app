'use client'

type Props = {
    isOpen: boolean
    onClose: () => void
    children: React.ReactNode
}

export default function AuthModal({ isOpen, onClose, children }: Props) {
    if (!isOpen) return null

    return (
        <div style={overlayStyle}>
            <div style={modalStyle}>
                <button onClick={onClose} style={closeBtnStyle}>✕</button>
                {children}
            </div>
        </div>
    )
}

const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 50,
};

const modalStyle: React.CSSProperties = {
    background: '#363636',
    padding: 24,
    borderRadius: 8,
    width: 400,
    position: 'relative',
};

const closeBtnStyle: React.CSSProperties = {
    position: 'absolute',
    top: 8,
    right: 8,
}
