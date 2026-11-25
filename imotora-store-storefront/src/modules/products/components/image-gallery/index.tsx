import { HttpTypes } from "@medusajs/types"
import { Container } from "@medusajs/ui"
import Image from "next/image"

type ImageGalleryProps = {
  images: HttpTypes.StoreProductImage[]
}

const ImageGallery = ({ images }: ImageGalleryProps) => {
  return (
    <div className="flex items-start relative w-full">
      <div className="flex flex-col flex-1 lg:mx-4 gap-y-4 w-full">
        {images.map((image, index) => {
          return (
            <Container
              key={image.id}
              className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-50 border border-zinc-200/80 rounded-xl shadow-none"
              id={image.id}
            >
              {!!image.url && (
                <Image
                  src={image.url}
                  priority={index <= 2 ? true : false}
                  className="absolute inset-0 w-full h-full object-contain p-2 sm:p-3 rounded-xl"
                  alt={`Product image ${index + 1}`}
                  fill
                  sizes="(max-width: 576px) 100vw, (max-width: 992px) 60vw, 600px"
                />
              )}
            </Container>
          )
        })}
      </div>
    </div>
  )
}

export default ImageGallery
