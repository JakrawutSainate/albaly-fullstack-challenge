'use client'

export function triggerConfetti() {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9999';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    if (!ctx) {
        document.body.removeChild(canvas);
        return;
    }

    const { innerWidth: width, innerHeight: height } = window;
    canvas.width = width;
    canvas.height = height;

    const particles: Particle[] = [];
    const colors = ['#6366f1', '#a855f7', '#ec4899', '#14b8a6', '#f59e0b'];

    class Particle {
        x: number;
        y: number;
        vx: number;
        vy: number;
        color: string;
        size: number;
        rotation: number;
        rotationSpeed: number;

        constructor() {
            this.x = width / 2;
            this.y = height / 2;
            this.vx = (Math.random() - 0.5) * 20;
            this.vy = (Math.random() - 0.5) * 20 - 5;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.size = Math.random() * 10 + 5;
            this.rotation = Math.random() * 360;
            this.rotationSpeed = (Math.random() - 0.5) * 10;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.vy += 0.5; // Gravity
            this.rotation += this.rotationSpeed;
            this.size *= 0.96; // Shrink
        }

        draw(ctx: CanvasRenderingContext2D) {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate((this.rotation * Math.PI) / 180);
            ctx.fillStyle = this.color;
            ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
            ctx.restore();
        }
    }

    for (let i = 0; i < 100; i++) {
        particles.push(new Particle());
    }

    let animationId: number;
    const animate = () => {
        if (!ctx) return;
        ctx.clearRect(0, 0, width, height);

        let activeParticles = false;
        particles.forEach(p => {
            if (p.size > 0.5) {
                p.update();
                p.draw(ctx);
                activeParticles = true;
            }
        });

        if (activeParticles) {
            animationId = requestAnimationFrame(animate);
        } else {
            cancelAnimationFrame(animationId);
            document.body.removeChild(canvas);
        }
    };

    animate();
}
