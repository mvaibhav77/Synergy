
// // import React, { useState, useRef } from 'react';
// // import { useDispatch, useSelector } from 'react-redux';
// // import { createPost } from '@/slices/postSlice';
// // import {
// //   Card,
// //   CardContent
// // } from '@/components/ui/card';
// // import {
// //   Avatar,
// //   AvatarFallback,
// //   AvatarImage
// // } from '@/components/ui/avatar';
// // import {
// //   Tooltip,
// //   TooltipContent,
// //   TooltipProvider,
// //   TooltipTrigger
// // } from '@/components/ui/tooltip';
// // import { Button } from '@/components/ui/button';
// // import { Textarea } from '@/components/ui/textarea';
// // import {
// //   ImageIcon,
// //   SmileIcon,
// //   MapPinIcon,
// //   PaperclipIcon,
// //   SendIcon
// // } from 'lucide-react';
// // import { Loader2 } from 'lucide-react';
// // import { UserInfo } from '@/utils/types';
// // import { RootState } from '@/store';
// // // import { RootState } from '@reduxjs/toolkit/query';

// // const CreatePostComponent = () => {
// //   const { userInfo } = useSelector((state: RootState) => state.auth) as {
// //     userInfo: UserInfo;
// //   };
// //   const [content, setContent] = useState('');
// //   const [selectedImages, setSelectedImages] = useState([]);
// //   const [location, setLocation] = useState('');
// //   const [isLoading, setIsLoading] = useState(false);
// //   const fileInputRef = useRef(null);
// //   const dispatch = useDispatch();

// //   const handleImageSelect = (e) => {
// //     if (e.target.files && e.target.files.length > 0) {
// //       // Convert FileList to Array and add to existing images
// //       const newFiles = Array.from(e.target.files);
// //       setSelectedImages(prevImages => [...prevImages, ...newFiles]);
// //     }
// //   };

// //   const handleSubmit = async () => {
// //     // Validate content
// //     if (!content.trim() && selectedImages.length === 0) {
// //       return;
// //     }

// //     setIsLoading(true);

// //     try {
// //       // Create FormData to send both text and images
// //       const formData = new FormData();
// //       formData.append('content', content);

// //       if (location) {
// //         formData.append('location', location);
// //       }

// //       // Append each image to FormData
// //       selectedImages.forEach((image) => {
// //         formData.append('images', image);
// //       });

// //       // Dispatch create post action
// //       await dispatch(createPost(formData)).unwrap();

// //       // Reset form after successful post
// //       setContent('');
// //       setSelectedImages([]);
// //       setLocation('');
// //     } catch (error) {
// //       console.error('Failed to create post:', error);
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// //   return (
// //     <Card className="mb-6">
// //       <CardContent className="p-6">
// //         <div className="flex gap-4">
// //           <Avatar className="h-10 w-10">
// //             <AvatarImage src={userInfo.avatar || "https://github.com/shadcn.png"} alt={userInfo.name} />
// //             <AvatarFallback>{userInfo.name.slice(0, 1)}</AvatarFallback>
// //           </Avatar>

// //           <div className="flex-1 space-y-4">
// //             <Textarea
// //               value={content}
// //               onChange={(e) => setContent(e.target.value)}
// //               className="min-h-[100px] resize-none text-sm focus-visible:ring-1"
// //               placeholder={`What's on your mind, ${userInfo.name.split(' ')[0]}?`}
// //             />

// //             {selectedImages.length > 0 && (
// //               <div className="flex gap-2 flex-wrap">
// //                 {selectedImages.map((file, index) => (
// //                   <div key={index} className="relative">
// //                     <img
// //                       src={URL.createObjectURL(file)}
// //                       alt={`Selected ${index + 1}`}
// //                       className="h-20 w-20 object-cover rounded"
// //                     />
// //                     <button
// //                       onClick={() => setSelectedImages(images => images.filter((_, i) => i !== index))}
// //                       className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 text-xs"
// //                     >
// //                       ×
// //                     </button>
// //                   </div>
// //                 ))}
// //               </div>
// //             )}

// //             <div className="flex items-center justify-between">
// //               <div className="flex gap-1">
// //                 <TooltipProvider>
// //                   <Tooltip>
// //                     <TooltipTrigger asChild>
// //                       <Button
// //                         variant="ghost"
// //                         size="icon"
// //                         className="h-9 w-9"
// //                         onClick={() => fileInputRef.current?.click()}
// //                       >
// //                         <ImageIcon className="h-5 w-5" />
// //                         <span className="sr-only">Add image</span>
// //                       </Button>
// //                     </TooltipTrigger>
// //                     <TooltipContent>Add image</TooltipContent>
// //                   </Tooltip>

// //                   <input
// //                     type="file"
// //                     ref={fileInputRef}
// //                     className="hidden"
// //                     multiple
// //                     accept="image/*"
// //                     onChange={handleImageSelect}
// //                   />

// //                   <Tooltip>
// //                     <TooltipTrigger asChild>
// //                       <Button variant="ghost" size="icon" className="h-9 w-9">
// //                         <SmileIcon className="h-5 w-5" />
// //                         <span className="sr-only">Add emoji</span>
// //                       </Button>
// //                     </TooltipTrigger>
// //                     <TooltipContent>Add emoji</TooltipContent>
// //                   </Tooltip>

// //                   <Tooltip>
// //                     <TooltipTrigger asChild>
// //                       <Button
// //                         variant="ghost"
// //                         size="icon"
// //                         className="h-9 w-9"
// //                         onClick={() => {
// //                           const loc = prompt("Enter location:");
// //                           if (loc) setLocation(loc);
// //                         }}
// //                       >
// //                         <MapPinIcon className="h-5 w-5" />
// //                         <span className="sr-only">Add location</span>
// //                       </Button>
// //                     </TooltipTrigger>
// //                     <TooltipContent>Add location</TooltipContent>
// //                   </Tooltip>

// //                   <Tooltip>
// //                     <TooltipTrigger asChild>
// //                       <Button variant="ghost" size="icon" className="h-9 w-9">
// //                         <PaperclipIcon className="h-5 w-5" />
// //                         <span className="sr-only">Attach file</span>
// //                       </Button>
// //                     </TooltipTrigger>
// //                     <TooltipContent>Attach file</TooltipContent>
// //                   </Tooltip>
// //                 </TooltipProvider>
// //               </div>

// //               <Button
// //                 className="px-6"
// //                 onClick={handleSubmit}
// //                 disabled={isLoading || (!content.trim() && selectedImages.length === 0)}
// //               >
// //                 {isLoading ? (
// //                   <Loader2 className="h-4 w-4 animate-spin" />
// //                 ) : (
// //                   <>
// //                     <SendIcon className="mr-2 h-4 w-4" />
// //                     Post
// //                   </>
// //                 )}
// //               </Button>
// //             </div>
// //           </div>
// //         </div>
// //       </CardContent>
// //     </Card>
// //   );
// // };

// // export default CreatePostComponent;
// import React, { useState, useRef } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { createPost } from '@/slices/postSlice';
// import { 
//   Card, 
//   CardContent 
// } from '@/components/ui/card';
// import { 
//   Avatar, 
//   AvatarFallback, 
//   AvatarImage 
// } from '@/components/ui/avatar';
// import { 
//   Tooltip, 
//   TooltipContent, 
//   TooltipProvider, 
//   TooltipTrigger 
// } from '@/components/ui/tooltip';
// import { Button } from '@/components/ui/button';
// import { Textarea } from '@/components/ui/textarea';
// import { 
//   ImageIcon, 
//   SmileIcon, 
//   MapPinIcon, 
//   PaperclipIcon, 
//   SendIcon 
// } from 'lucide-react';
// import { Loader2 } from 'lucide-react';
// import { RootState } from '@/store';
// import { UserInfo } from '@/utils/types';

// const CreatePostComponent = () => {
//   const { userInfo } = useSelector((state: RootState) => state.auth) as {
//         userInfo: UserInfo;
//       };

//   const [content, setContent] = useState('');
//   const [selectedImages, setSelectedImages] = useState([]);
//   const [location, setLocation] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const fileInputRef = useRef(null);
//   const dispatch = useDispatch();

//   const handleImageSelect = (e) => {
//     if (e.target.files && e.target.files.length > 0) {
//       // Convert FileList to Array and add to existing images
//       const newFiles = Array.from(e.target.files);
//       setSelectedImages(prevImages => [...prevImages, ...newFiles]);
//     }
//   };

//   const handleSubmit = async () => {
//     // Validate content
//     if (!content.trim() && selectedImages.length === 0) {
//       return;
//     }

//     setIsLoading(true);

//     try {
//       // Create FormData to send both text and images
//       const formData = new FormData();
//       formData.append('content', content);
      
//       if (location) {
//         formData.append('location', location);
//       }

//       // Append each image to FormData
//       selectedImages.forEach((image) => {
//         formData.append('images', image);
//       });

//       // Dispatch create post action
//       await dispatch(createPost(formData)).unwrap();

//       // Reset form after successful post
//       setContent('');
//       setSelectedImages([]);
//       setLocation('');
//     } catch (error) {
//       console.error('Failed to create post:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <Card className="mb-6">
//       <CardContent className="p-6">
//         <div className="flex gap-4">
//           <Avatar className="h-10 w-10">
//             <AvatarImage src={userInfo.avatar || "https://github.com/shadcn.png"} alt={userInfo.name} />
//             <AvatarFallback>{userInfo.name.slice(0, 1)}</AvatarFallback>
//           </Avatar>

//           <div className="flex-1 space-y-4">
//             <Textarea 
//               value={content}
//               onChange={(e) => setContent(e.target.value)}
//               className="min-h-[100px] resize-none text-sm focus-visible:ring-1"
//               placeholder={`What's on your mind, ${userInfo.name.split(' ')[0]}?`}
//             />

//             {selectedImages.length > 0 && (
//               <div className="flex gap-2 flex-wrap">
//                 {selectedImages.map((file, index) => (
//                   <div key={index} className="relative">
//                     <img
//                       src={URL.createObjectURL(file)}
//                       alt={`Selected ${index + 1}`}
//                       className="h-20 w-20 object-cover rounded"
//                     />
//                     <button
//                       onClick={() => setSelectedImages(images => images.filter((_, i) => i !== index))}
//                       className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 text-xs"
//                     >
//                       ×
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             )}

//             <div className="flex items-center justify-between">
//               <div className="flex gap-1">
//                 <TooltipProvider>
//                   <Tooltip>
//                     <TooltipTrigger asChild>
//                       <Button
//                         variant="ghost"
//                         size="icon"
//                         className="h-9 w-9"
//                         onClick={() => fileInputRef.current?.click()}
//                       >
//                         <ImageIcon className="h-5 w-5" />
//                         <span className="sr-only">Add image</span>
//                       </Button>
//                     </TooltipTrigger>
//                     <TooltipContent>Add image</TooltipContent>
//                   </Tooltip>

//                   <input
//                     type="file"
//                     ref={fileInputRef}
//                     className="hidden"
//                     multiple
//                     accept="image/*"
//                     onChange={handleImageSelect}
//                   />

//                   <Tooltip>
//                     <TooltipTrigger asChild>
//                       <Button variant="ghost" size="icon" className="h-9 w-9">
//                         <SmileIcon className="h-5 w-5" />
//                         <span className="sr-only">Add emoji</span>
//                       </Button>
//                     </TooltipTrigger>
//                     <TooltipContent>Add emoji</TooltipContent>
//                   </Tooltip>

//                   <Tooltip>
//                     <TooltipTrigger asChild>
//                       <Button
//                         variant="ghost"
//                         size="icon"
//                         className="h-9 w-9"
//                         onClick={() => {
//                           const loc = prompt("Enter location:");
//                           if (loc) setLocation(loc);
//                         }}
//                       >
//                         <MapPinIcon className="h-5 w-5" />
//                         <span className="sr-only">Add location</span>
//                       </Button>
//                     </TooltipTrigger>
//                     <TooltipContent>Add location</TooltipContent>
//                   </Tooltip>

//                   <Tooltip>
//                     <TooltipTrigger asChild>
//                       <Button variant="ghost" size="icon" className="h-9 w-9">
//                         <PaperclipIcon className="h-5 w-5" />
//                         <span className="sr-only">Attach file</span>
//                       </Button>
//                     </TooltipTrigger>
//                     <TooltipContent>Attach file</TooltipContent>
//                   </Tooltip>
//                 </TooltipProvider>
//               </div>

//               <Button 
//                 className="px-6" 
//                 onClick={handleSubmit}
//                 disabled={isLoading || (!content.trim() && selectedImages.length === 0)}
//               >
//                 {isLoading ? (
//                   <Loader2 className="h-4 w-4 animate-spin" />
//                 ) : (
//                   <>
//                     <SendIcon className="mr-2 h-4 w-4" />
//                     Post
//                   </>
//                 )}
//               </Button>
//             </div>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// export default CreatePostComponent;
import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createPost } from '@/slices/postSlice';
import { 
  Card, 
  CardContent 
} from '@/components/ui/card';
import { 
  Avatar, 
  AvatarFallback, 
  AvatarImage 
} from '@/components/ui/avatar';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  ImageIcon, 
  SmileIcon, 
  MapPinIcon, 
  PaperclipIcon, 
  SendIcon 
} from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { RootState } from '@/store';
import { UserInfo } from '@/utils/types';
import { toast } from 'sonner'; // For displaying error/success messages

const CreatePostComponent = () => {
  const { userInfo } = useSelector((state: RootState) => state.auth) as {
    userInfo: UserInfo;
  };

  const [content, setContent] = useState('');
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [location, setLocation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // Convert FileList to Array and add to existing images
      const newFiles = Array.from(e.target.files);
      setSelectedImages(prevImages => [...prevImages, ...newFiles]);
    }
  };

  const handleSubmit = async () => {
    // Validate content
    if (!content.trim() && selectedImages.length === 0) {
      toast.error('Post must contain content or images');
      return;
    }

    setIsLoading(true);

    try {
      // Create FormData to send both text and images
      const formData = new FormData();
      formData.append('content', content);
      
      if (location) {
        formData.append('location', location);
      }

      // Append each image to FormData
      selectedImages.forEach((image) => {
        formData.append('images', image);
      });

      // Dispatch create post action
      await dispatch(createPost(formData)).unwrap();

      // Reset form after successful post
      setContent('');
      setSelectedImages([]);
      setLocation('');

      toast.success('Post created successfully!');
    } catch (error) {
      console.error('Failed to create post:', error);
      toast.error('Failed to create post. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex gap-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={userInfo.avatar || "https://github.com/shadcn.png"} alt={userInfo.name} />
            <AvatarFallback>{userInfo.name.slice(0, 1)}</AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-4">
            <Textarea 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[100px] resize-none text-sm focus-visible:ring-1"
              placeholder={`What's on your mind, ${userInfo.name.split(' ')[0]}?`}
            />

            {selectedImages.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {selectedImages.map((file, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Selected ${index + 1}`}
                      className="h-20 w-20 object-cover rounded"
                    />
                    <button
                      onClick={() => setSelectedImages(images => images.filter((_, i) => i !== index))}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 text-xs"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex gap-1">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <ImageIcon className="h-5 w-5" />
                        <span className="sr-only">Add image</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Add image</TooltipContent>
                  </Tooltip>

                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    multiple
                    accept="image/*"
                    onChange={handleImageSelect}
                  />

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-9 w-9">
                        <SmileIcon className="h-5 w-5" />
                        <span className="sr-only">Add emoji</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Add emoji</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9"
                        onClick={() => {
                          const loc = prompt("Enter location:");
                          if (loc) setLocation(loc);
                        }}
                      >
                        <MapPinIcon className="h-5 w-5" />
                        <span className="sr-only">Add location</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Add location</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-9 w-9">
                        <PaperclipIcon className="h-5 w-5" />
                        <span className="sr-only">Attach file</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Attach file</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <Button 
                className="px-6" 
                onClick={handleSubmit}
                disabled={isLoading || (!content.trim() && selectedImages.length === 0)}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <SendIcon className="mr-2 h-4 w-4" />
                    Post
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreatePostComponent;