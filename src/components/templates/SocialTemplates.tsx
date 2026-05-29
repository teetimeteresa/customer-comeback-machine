import React from 'react';
import { Sparkles, Heart, Star, ShoppingBag, Bell, Gift, Users } from 'lucide-react';

interface SocialTemplateProps {
  businessName: string;
  businessType: string;
  brandTone: string;
}

/**
 * SOCIAL TEMPLATE 1: THE ANTICIPATION (COMING SOON)
 */
export const ComingSoonTemplate: React.FC<SocialTemplateProps> = ({ businessName }) => {
  return (
    <div className="w-[1080px] h-[1080px] bg-white flex flex-col items-center justify-center p-0 overflow-hidden border border-slate-100 shadow-2xl mx-auto">
      {/* Visual background element */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none">
        <div className="grid grid-cols-10 gap-20 transform rotate-12 -translate-x-20 -translate-y-20">
          {Array.from({ length: 100 }).map((_, i) => (
            <Sparkles key={i} size={80} />
          ))}
        </div>
      </div>

      <div className="z-10 text-center px-20">
        <div className="inline-flex items-center gap-3 px-6 py-2 bg-amber-500 text-white rounded-full text-xl font-black uppercase tracking-[0.3em] mb-12 shadow-lg shadow-amber-500/20">
          <Bell size={24} />
          Coming Soon
        </div>
        
        <h1 className="text-8xl font-black text-slate-900 leading-none tracking-tighter mb-8">
          Something <span className="text-amber-500 underline decoration-slate-100 underline-offset-8">special</span> is arriving at {businessName}.
        </h1>
        
        <p className="text-4xl text-slate-500 font-medium leading-tight mb-16">
          A new way to stay connected, get rewarded, and enjoy more of what you love. 
        </p>

        <div className="p-12 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
          <p className="text-2xl font-black text-slate-400 uppercase tracking-widest">
            Watch this space for our new VIP launch.
          </p>
        </div>
      </div>
    </div>
  );
};

/**
 * SOCIAL TEMPLATE 2: THE VIP CLUB (DIRECT INVITE)
 */
export const VIPClubTemplate: React.FC<SocialTemplateProps> = ({ businessName }) => {
  return (
    <div className="w-[1080px] h-[1080px] bg-slate-900 flex flex-col items-center justify-center p-0 overflow-hidden border border-slate-800 shadow-2xl mx-auto">
      {/* Decorative gradient blur */}
      <div className="absolute top-[-20%] right-[-20%] w-[60%] h-[60%] bg-amber-500/10 blur-[150px] rounded-full"></div>
      <div className="absolute bottom-[-20%] left-[-20%] w-[60%] h-[60%] bg-amber-500/5 blur-[150px] rounded-full"></div>

      <div className="z-10 text-center px-16">
        <div className="h-32 w-32 bg-amber-500 rounded-[2.5rem] flex items-center justify-center text-white mx-auto mb-12 shadow-2xl shadow-amber-500/20 transform rotate-3">
          <Sparkles size={64} />
        </div>

        <h1 className="text-8xl font-black text-white leading-none tracking-tight mb-10">
          Join the <br/> <span className="text-amber-500">VIP Club.</span>
        </h1>
        
        <p className="text-4xl text-slate-400 font-medium leading-relaxed mb-16 max-w-3xl mx-auto">
          Want a special treat on your next visit? Scan our counter sign and join the list!
        </p>

        <div className="flex justify-center gap-10">
          <div className="flex items-center gap-4 text-white">
            <div className="h-12 w-12 rounded-full bg-slate-800 flex items-center justify-center border border-amber-500/30">
              <Gift size={24} className="text-amber-500" />
            </div>
            <span className="text-xl font-bold uppercase tracking-widest">Rewards</span>
          </div>
          <div className="flex items-center gap-4 text-white">
            <div className="h-12 w-12 rounded-full bg-slate-800 flex items-center justify-center border border-amber-500/30">
              <Star size={24} className="text-amber-500" />
            </div>
            <span className="text-xl font-bold uppercase tracking-widest">Exclusive</span>
          </div>
          <div className="flex items-center gap-4 text-white">
            <div className="h-12 w-12 rounded-full bg-slate-800 flex items-center justify-center border border-amber-500/30">
              <Heart size={24} className="text-amber-500" />
            </div>
            <span className="text-xl font-bold uppercase tracking-widest">Community</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * SOCIAL TEMPLATE 3: THE BIRTHDAY INVITE
 */
export const BirthdayInviteTemplate: React.FC<SocialTemplateProps> = ({ businessName }) => {
  return (
    <div className="w-[1080px] h-[1080px] bg-amber-500 flex flex-col items-center justify-center p-0 overflow-hidden shadow-2xl mx-auto">
      {/* Pattern overlay */}
      <div className="absolute inset-0 opacity-10 flex flex-wrap gap-20 p-20">
        {Array.from({ length: 40 }).map((_, i) => (
          <Gift key={i} size={100} />
        ))}
      </div>

      <div className="z-10 bg-white m-12 p-20 rounded-[4rem] shadow-2xl text-center border-4 border-amber-600/10">
        <h2 className="text-3xl font-black text-amber-600 uppercase tracking-[0.4em] mb-6 leading-none">
          Let's Celebrate You
        </h2>
        
        <h1 className="text-[120px] font-black text-slate-900 leading-[0.85] tracking-tighter mb-12">
          Your <br/> Birthday <br/> <span className="text-amber-500">Gift</span> <br/> Awaits.
        </h1>
        
        <p className="text-4xl text-slate-500 font-medium leading-relaxed mb-16">
          Join our Birthday Club today and we'll send you something special every year.
        </p>

        <div className="inline-block px-12 py-6 bg-slate-900 text-white rounded-[2rem] text-3xl font-black uppercase tracking-widest shadow-xl">
          Scan to Join
        </div>
      </div>
    </div>
  );
};

/**
 * SOCIAL TEMPLATE 4: THE REVIEW REQUEST
 */
export const SocialProofTemplate: React.FC<SocialTemplateProps> = ({ businessName }) => {
  return (
    <div className="w-[1080px] h-[1080px] bg-white flex flex-col items-center justify-center p-0 overflow-hidden border border-slate-100 shadow-2xl mx-auto">
      <div className="z-10 text-center px-16">
        <div className="flex justify-center gap-2 mb-12">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star key={i} size={64} fill="#F59E0B" className="text-amber-500" />
          ))}
        </div>

        <h1 className="text-9xl font-black text-slate-900 leading-none tracking-tighter mb-10">
          Loved <br/> Your <span className="text-amber-500 italic">Visit?</span>
        </h1>
        
        <p className="text-5xl text-slate-500 font-medium leading-tight mb-20 max-w-4xl mx-auto">
          Your support means the world to us. Let us know how we did!
        </p>

        <div className="flex flex-col items-center">
          <div className="h-2 w-48 bg-amber-500 mb-12"></div>
          <p className="text-3xl font-black text-slate-900 uppercase tracking-widest mb-4">
            Scan to leave a review
          </p>
          <div className="flex items-center gap-4 text-slate-400">
            <Heart size={32} className="text-pink-500 fill-pink-500" />
            <span className="text-2xl font-bold">Made with love in our local shop</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * SOCIAL TEMPLATE 5: THE SUPPORT LOCAL CALL
 */
export const SupportLocalTemplate: React.FC<SocialTemplateProps> = ({ businessType }) => {
  return (
    <div className="w-[1080px] h-[1080px] bg-slate-50 flex flex-col items-center justify-center p-0 overflow-hidden border border-slate-200 shadow-2xl mx-auto">
      <div className="absolute top-0 w-full h-1/2 bg-amber-500"></div>
      
      <div className="z-10 relative bg-white w-[900px] h-[900px] rounded-full shadow-2xl border-[16px] border-slate-50 flex flex-col items-center justify-center p-20 text-center">
        <ShoppingBag size={120} className="text-amber-500 mb-10" />
        
        <h1 className="text-7xl font-black text-slate-900 leading-tight tracking-tight mb-8">
          Shop Small. <br/> <span className="text-amber-500">Stay Connected.</span>
        </h1>
        
        <p className="text-3xl text-slate-500 font-medium leading-relaxed mb-12">
          Help your favorite local {businessType || 'business'} thrive. Join our list for updates and rewards.
        </p>

        <div className="flex items-center gap-6">
          <div className="h-2 w-12 bg-slate-200"></div>
          <Users size={40} className="text-slate-300" />
          <div className="h-2 w-12 bg-slate-200"></div>
        </div>
      </div>
    </div>
  );
};

export const SuggestedCaptions = {
  comingSoon: (name: string) => `✨ Something special is arriving at ${name}! We're launching our new VIP Club to better reward our favorite customers. Stay tuned for the big reveal! #SupportLocal #VIPClub #ComingSoon`,
  vipClub: (name: string) => `Want to get the inside scoop on everything at ${name}? Join our new VIP Club! Just scan the sign at our counter on your next visit to join the list and get a special thank-you treat. 🎁 #LocalLove #VIPRewards #${name.replace(/\s/g, '')}`,
  birthday: () => `It's almost your big day! 🎂 Join our Birthday Club to receive a special gift from us every year. We love celebrating with our community! Scan the QR code in-shop to join. #BirthdayTreat #CelebrateLocal`,
  socialProof: () => `Did you have a 5-star experience? ⭐ We'd love to hear about it! Your reviews help our small business grow. Scan our counter sign to share your feedback. Thank you for being part of our story! #CustomerLove #ReviewUs`,
  supportLocal: (type: string) => `Choosing to shop local makes a big difference. 🏠 When you join our customer list, you're helping our ${type || 'shop'} thrive. Plus, you'll be the first to know about new arrivals! #ShopSmall #SupportLocal #CommunityFirst`
};
